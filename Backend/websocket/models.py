from django.db import models
from django.conf import settings


class Hotel(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  
        on_delete=models.CASCADE,
        related_name="hoteles"
    )
    consumo_total = models.FloatField(default=0.0)
    presupuesto = models.FloatField(default=0.0)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Consumo Total{self.consumo_total} - Presupuesto {self.presupuesto}"

    def actualizar_cosumo_total(self):

        habitaciones = self.habitaciones.all()
        self.consumo_total = sum(habitacion.consumo_total for habitacion in habitaciones)
        self.save()
    


class Habitacion(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="habitaciones", default=1)
    numero = models.PositiveIntegerField()
    consumo = models.FloatField(default=0.0)
    nivel = models.PositiveIntegerField(default=1)
    images=models.ImageField(upload_to='photos/',default='photos/habitacion1.png')
    presencia_humana = models.BooleanField(default=False)
    temperatura = models.FloatField(default=0.0)
    humedad = models.FloatField(default=0.0)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Habitación {self.numero} - Nivel {self.nivel}"


class Dispositivo(models.Model):
    TIPOS_DISPOSITIVO = [
        ('AIRE', 'Aire Acondicionado'),
        ('VENTILADOR', 'Ventilador'),
        ('TELEVISOR', 'Televisor'),
        ('FOCO_HABITACION', 'Foco Habitación'),
        ('FOCO_BANO', 'Foco Baño'),
    ]

    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name="dispositivos")
    tipo = models.CharField(max_length=50, choices=TIPOS_DISPOSITIVO)
    consumo_actual = models.FloatField(default=0.0)
    apagado_remoto = models.BooleanField(default=False)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_tipo_display()} - Habitación {self.habitacion.numero}"

class RegistroConsumo(models.Model):
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name="registros")
    consumo = models.FloatField() 
    fecha = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.dispositivo.get_tipo_display()} - {self.consumo} kWh - {self.fecha}"

class Alerta(models.Model):
    TIPOS_ALERTA = [
        ('CONSUMO_ALTO', 'Consumo Alto'),
        ('FALLA_SENSOR', 'Falla de Sensor'),
        ('APAGADO_MANUAL', 'Apagado Manual'),
        
    ]

    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, related_name="alertas")
    tipo = models.CharField(max_length=50, choices=TIPOS_ALERTA)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alerta {self.tipo} - {self.habitacion}"

