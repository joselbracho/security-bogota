from django.db import models

class Camera(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Maintenance', 'Maintenance'),
    ]

    id = models.CharField(max_length=50, primary_key=True)
    model = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    last_maintenance = models.DateField(null=True, blank=True)
    locality = models.CharField(max_length=100)
    rtsp_url = models.CharField(max_length=255, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.id

class Ticket(models.Model):
    TYPE_CHOICES = [
        ('Corrective', 'Corrective'),
        ('Preventive', 'Preventive'),
    ]
    STATUS_CHOICES = [
        ('New', 'New'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    ]
    PRIORITY_CHOICES = [
        ('Critical', 'Critical'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    id = models.CharField(max_length=50, primary_key=True)
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='tickets')
    ticket_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.id
