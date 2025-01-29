from django.contrib import admin
from .models import *

@admin.register(User)
class NivelAdmin(admin.ModelAdmin):
    list_display = ('username','email','rol')
    list_filter=('rol',)
