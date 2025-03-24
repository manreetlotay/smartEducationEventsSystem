from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now

# Create your models here.


class User(AbstractUser):
    phone_number = models.CharField(
        max_length=20,
        null=True
    )
    profile_image = models.ImageField(
        null=True
    )
    points = models.IntegerField(
        default=0
    )
    profession = models.CharField(
        max_length=20,
        null=True
    )

    class UserType(models.TextChoices):
        INDIVIDUAL = "individual"
        ORGANIZATION = "organization"

    user_type = models.CharField(
        max_length=12,
        choices=UserType.choices,
        default=UserType.INDIVIDUAL
    )
    organization_name = models.CharField(
        max_length=200,
        null=True
    )
    organization_address = models.CharField(
        max_length=200,
        null=True
    )


class Tag(models.Model):
    text = models.CharField(
        max_length=100,
        null=True
    )


class Event(models.Model):
    name = models.CharField(
        max_length=200,
    )
    description = models.CharField(
        max_length=10000,
        default=''
    )

    class EventFormat(models.TextChoices):
        ONLINE = "online"
        PERSON = "in-person"
        HYBRID = "hybrid"
    event_format = models.CharField(
        max_length=10,
        choices=EventFormat.choices,
        default=EventFormat.ONLINE
    )
    # https://docs.djangoproject.com/en/5.1/topics/db/examples/many_to_many/
    tags = models.ManyToManyField(Tag)
    banner_image = models.ImageField(null=True)
    start = models.DateTimeField(default=now)
    end = models.DateTimeField(default=now)
    capacity = models.IntegerField(default=1000)
    registration_deadline = models.DateTimeField(null=True)
    address = models.CharField(max_length=200, null=True)
    virtual_platform_link = models.CharField(max_length=300, null=True)
    is_free = models.BooleanField(default=True)
    price = models.DecimalField(null=True, decimal_places=2, max_digits=2e32)
    agenda = models.CharField(max_length=10000, default='')

    def organizers(self):
        return User.objects.filter(ticket__event=self,
                                   ticket__role=Ticket.UserRole.ORGANIZER)

    def attendee(self):
        return User.objects.filter(ticket__event=self,
                                   ticket__role=Ticket.UserRole.ATTENDEE)

    def stakeholder(self):
        return User.objects.filter(ticket__event=self,
                                   ticket__role=Ticket.UserRole.STAKEHOLDER)

    def speaker(self):
        return User.objects.filter(ticket__event=self,
                                   ticket__role=Ticket.UserRole.SPREAKER)

    def sponsor(self):
        return User.objects.filter(ticket__event=self,
                                   ticket__role=Ticket.UserRole.SPONSOR)

    def __str__(self):
        return self.name


class Ticket(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user')
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='event')

    class UserRole(models.TextChoices):
        ORGANIZER = "organizer"
        ATTENDEE = "attendee"
        STAKEHOLDER = "stakeholder"
        SPREAKER = "speaker"
        EVENT_ADMIN = "event_admin"
        SPONSOR = "sponsor"
    role = models.CharField(
        max_length=12,
        choices=UserRole.choices,
        default=UserRole.ATTENDEE
    )
    access_code = models.CharField(
        max_length=200,
        null=True
    )
    virtual_link = models.CharField(
        max_length=200,
        null=True
    )
    qr_code = models.CharField(
        max_length=300,
        null=True
    )
    registration_date = models.DateField(default=now)
    is_bonus_ticket = models.BooleanField(default=True)
