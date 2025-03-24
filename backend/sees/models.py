from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class User(AbstractUser):
    phone_number = models.CharField(
        max_length=20,
        null=True
    )


class Attendee(User):
    pass


class Stakeholder(User):
    pass


class Speaker(Attendee):
    pass


class Learner(Attendee):
    pass


class Event(models.Model):
    name = models.CharField(
        max_length=20,
    )

    def __str__(self):
        return self.name


class Ticket(models.Model):
    attendee = models.ForeignKey(
        Attendee, on_delete=models.CASCADE, related_name='attendee')
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='event')
