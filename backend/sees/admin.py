from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Attendee, Ticket, Event

# Register your models here.

admin.site.register(User, UserAdmin)
admin.site.register(Attendee)
admin.site.register(Ticket)
admin.site.register(Event)
