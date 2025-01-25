from django.contrib import admin
from .models import Hotel, Habitacion, Dispositivo , RegistroConsumo

@admin.register(Hotel)
class PisoAdmin(admin.ModelAdmin):
    list_display = ('user','consumo_total','presupuesto', 'fecha_actualizacion')


@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ('numero', 'nivel','presencia_humana','temperatura','humedad', 'fecha_actualizacion')


@admin.register(Dispositivo)
class DispositivoAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'habitacion', 'consumo_actual', 'apagado_remoto', 'fecha_actualizacion')

@admin.register(RegistroConsumo)
class RegistroAdmin(admin.ModelAdmin):
    list_display = ('dispositivo','consumo','fecha')