# Generated by Django 5.1.7 on 2025-03-16 21:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('websocket', '0005_alter_dispositivo_tipo'),
    ]

    operations = [
        migrations.AddField(
            model_name='dispositivo',
            name='consumo_acumulado',
            field=models.FloatField(default=0.0),
        ),
    ]
