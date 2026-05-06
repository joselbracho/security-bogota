from rest_framework import serializers
from .models import Camera, Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class CameraSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Camera
        fields = '__all__'
