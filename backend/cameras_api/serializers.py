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

    def validate_latitude(self, value):
        if not (4.4 <= value <= 4.9):
            raise serializers.ValidationError("La latitud debe estar entre 4.4 y 4.9")
        return value

    def validate_longitude(self, value):
        if not (-74.3 <= value <= -73.9):
            raise serializers.ValidationError("La longitud debe estar entre -74.3 y -73.9")
        return value
