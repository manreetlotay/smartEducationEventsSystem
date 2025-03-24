from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Ticket, Event

# Register your models here.

admin.site.register(User, UserAdmin)
admin.site.register(Ticket)
admin.site.register(Event)
