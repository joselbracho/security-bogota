from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Camera

class CameraValidationTests(APITestCase):
    def test_create_camera_valid_coordinates(self):
        data = {
            "id": "CAM-VALID",
            "model": "Test Model",
            "location": "Test Location",
            "latitude": 4.6,
            "longitude": -74.1,
            "status": "Active",
            "locality": "Teusaquillo"
        }
        response = self.client.post('/api/v1/cameras/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_camera_invalid_latitude_low(self):
        data = {
            "id": "CAM-LAT-LOW",
            "model": "Test Model",
            "location": "Test Location",
            "latitude": 4.3,
            "longitude": -74.1,
            "status": "Active",
            "locality": "Teusaquillo"
        }
        response = self.client.post('/api/v1/cameras/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La latitud debe estar entre 4.4 y 4.9", str(response.data))

    def test_create_camera_invalid_latitude_high(self):
        data = {
            "id": "CAM-LAT-HIGH",
            "model": "Test Model",
            "location": "Test Location",
            "latitude": 5.0,
            "longitude": -74.1,
            "status": "Active",
            "locality": "Teusaquillo"
        }
        response = self.client.post('/api/v1/cameras/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La latitud debe estar entre 4.4 y 4.9", str(response.data))

    def test_create_camera_invalid_longitude_low(self):
        data = {
            "id": "CAM-LNG-LOW",
            "model": "Test Model",
            "location": "Test Location",
            "latitude": 4.6,
            "longitude": -74.4,
            "status": "Active",
            "locality": "Teusaquillo"
        }
        response = self.client.post('/api/v1/cameras/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La longitud debe estar entre -74.3 y -73.9", str(response.data))

    def test_create_camera_invalid_longitude_high(self):
        data = {
            "id": "CAM-LNG-HIGH",
            "model": "Test Model",
            "location": "Test Location",
            "latitude": 4.6,
            "longitude": -73.8,
            "status": "Active",
            "locality": "Teusaquillo"
        }
        response = self.client.post('/api/v1/cameras/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("La longitud debe estar entre -74.3 y -73.9", str(response.data))
