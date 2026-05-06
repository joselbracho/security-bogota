from rest_framework import viewsets, status, response, serializers
from rest_framework.decorators import action
from django.db.models import Count, Q, Avg, F
from django.utils import timezone
from .models import Camera, Ticket
from .serializers import CameraSerializer, TicketSerializer

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.filter(is_deleted=False)
    serializer_class = CameraSerializer

    def get_queryset(self):
        queryset = Camera.objects.filter(is_deleted=False)
        search = self.request.query_params.get('search')
        status_filter = self.request.query_params.get('status')
        locality = self.request.query_params.get('locality')

        if search:
            queryset = queryset.filter(
                Q(id__icontains=search) | 
                Q(model__icontains=search) | 
                Q(location__icontains=search)
            )
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if locality:
            queryset = queryset.filter(locality__icontains=locality)
        
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = Ticket.objects.all()
        status_filter = self.request.query_params.get('status')
        type_filter = self.request.query_params.get('ticket_type')
        priority = self.request.query_params.get('priority')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if type_filter:
            queryset = queryset.filter(ticket_type=type_filter)
        if priority:
            queryset = queryset.filter(priority=priority)
        
        return queryset

    def perform_update(self, serializer):
        instance = self.get_object()
        old_status = instance.status
        new_status = serializer.validated_data.get('status')

        if new_status and old_status != new_status:
            # Prevent going back from Resolved
            if old_status == 'Resolved':
                raise serializers.ValidationError({"status": "Cannot change status of a resolved ticket"})
            
            # Prevent going back to New from In Progress
            if old_status == 'In Progress' and new_status == 'New':
                raise serializers.ValidationError({"status": "Cannot revert from In Progress to New"})
            
            # Set closed_at if moving to Resolved
            if new_status == 'Resolved':
                serializer.save(closed_at=timezone.now())
                return

        serializer.save()

class DashboardViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_cameras = Camera.objects.filter(is_deleted=False).count()
        
        # Status distribution
        status_dist_raw = Camera.objects.filter(is_deleted=False).values('status').annotate(count=Count('id'))
        status_distribution = [
            {
                'status': item['status'],
                'count': item['count'],
                'percentage': (item['count'] / total_cameras * 100) if total_cameras > 0 else 0
            } for item in status_dist_raw
        ]

        active_cameras = Camera.objects.filter(is_deleted=False, status='Active').count()
        open_tickets = Ticket.objects.filter(status__in=['New', 'In Progress']).count()
        
        crit_high_open = Ticket.objects.filter(
            status__in=['New', 'In Progress'],
            priority__in=['Critical', 'High']
        ).count()
        crit_high_pct = (crit_high_open / open_tickets * 100) if open_tickets > 0 else 0

        # Avg resolution time
        resolved = Ticket.objects.filter(status='Resolved', closed_at__isnull=False)
        avg_res_time = None
        if resolved.exists():
            durations = [(t.closed_at - t.created_at).total_seconds() for t in resolved]
            avg_res_time = (sum(durations) / len(durations)) / 86400

        # Locality stats
        locality_stats = Camera.objects.values('locality').annotate(
            corrective=Count('tickets', filter=Q(tickets__ticket_type='Corrective')),
            preventive=Count('tickets', filter=Q(tickets__ticket_type='Preventive'))
        )

        return response.Response({
            'active_cameras': active_cameras,
            'open_tickets': open_tickets,
            'avg_resolution_time': avg_res_time,
            'critical_high_open_tickets_percentage': crit_high_pct,
            'status_distribution': status_distribution,
            'locality_stats': list(locality_stats)
        })
