# Generated by Django 5.1.7 on 2025-03-12 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('websocket', '0004_dispositivo_off_image_dispositivo_on_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dispositivo',
            name='tipo',
            field=models.CharField(choices=[('AIRE', 'Aire Acondicionado'), ('VENTILADOR', 'Ventilador'), ('TELEVISOR', 'Televisor'), ('FOCO_HABITACION', 'Foco Habitación'), ('FOCO_BAÑO', 'Foco Baño')], max_length=50),
        ),
    ]
