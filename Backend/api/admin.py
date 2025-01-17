from django.contrib import admin
from .models import Piso, Habitacion, Dispositivo , RegistroConsumo

@admin.register(Piso)
class PisoAdmin(admin.ModelAdmin):
    list_display = ('nivel', 'fecha_actualizacion')


@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ('numero', 'piso','presencia_humana','temperatura','humedad', 'fecha_actualizacion')


@admin.register(Dispositivo)
class DispositivoAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'habitacion', 'consumo_actual', 'apagado_remoto', 'fecha_actualizacion')

@admin.register(RegistroConsumo)
class RegistroAdmin(admin.ModelAdmin):
    list_display = ('dispositivo','consumo','fecha')