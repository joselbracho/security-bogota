from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cameras_api.views import CameraViewSet, TicketViewSet, DashboardViewSet

router = DefaultRouter()
router.register(r'cameras', CameraViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/dashboard/stats/', DashboardViewSet.as_view({'get': 'stats'})),
]
