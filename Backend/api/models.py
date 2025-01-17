from django.db import models

class Piso(models.Model):
    nivel = models.PositiveIntegerField()
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Piso {self.nivel}"


class Habitacion(models.Model):
    piso = models.ForeignKey(Piso, on_delete=models.CASCADE, related_name="habitaciones")
    numero = models.PositiveIntegerField()
    presencia_humana = models.BooleanField(default=False)
    temperatura = models.FloatField(default=0.0)
    humedad = models.FloatField(default=0.0)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Habitación {self.numero} - Piso {self.piso.nivel}"


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
    informacion = models.TextField()  # Detalles de la alerta
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alerta {self.tipo} - {self.habitacion}"