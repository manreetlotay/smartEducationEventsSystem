from django.shortcuts import render
from rest_framework import permissions, viewsets
from sees.serializers import UserSerializer, TicketSerializer, EventSerializer
from sees.models import User, Ticket, Event

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('id')
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('id')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
