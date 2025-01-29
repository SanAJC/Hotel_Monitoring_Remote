from django.contrib import admin
from .models import *

@admin.register(Hotel)
class NivelAdmin(admin.ModelAdmin):
    list_display = ('user','consumo_total','presupuesto')
    list_filter=('user',)


@admin.register(Nivel)
class NivelAdmin(admin.ModelAdmin):
    list_display = ('nivel','consumo','fecha_actualizacion')
    list_filter=('nivel',)

@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ('numero','consumo','presencia_humana','fecha_actualizacion')
    list_filter=('nivel',)
    search_fields=('numero',)

@admin.register(Dispositivo)
class DsipositivoAdmin(admin.ModelAdmin):
    list_display = ('habitacion','tipo','consumo_actual','fecha_actualizacion')
    list_filter=('habitacion','tipo')
    search_fields=('habitacion',)

@admin.register(RegistroConsumo)
class RegistroConsumoAdmin(admin.ModelAdmin):
    list_display = ('dispositivo','consumo','fecha')
    list_filter=('dispositivo',)
    search_fields=('dispositivo',)

@admin.register(Alerta)
class AlertaAdmin(admin.ModelAdmin):
    list_display = ('habitacion','tipo','fecha_creacion')
    list_filter=('habitacion',)
    search_fields=('habitacion',)
