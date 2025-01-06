from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from django.contrib import auth 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'rol']

class LoginSerializer(serializers.Serializer):  
    username = serializers.CharField()  
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")
        print(f"Intentando autenticar con username: {username} y password: {password}")
        
        # Autenticar usando el username y password
        user = auth.authenticate(username=username, password=password)
        
        if user is None:
            raise serializers.ValidationError("Error de autenticación")
        else:
            print(f"Autenticacion con exito {username}")

        if not user.is_active:
            raise serializers.ValidationError("Este usuario está inactivo")

        
        return user