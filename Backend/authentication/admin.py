from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from unfold.admin import ModelAdmin

class UserAdmin(BaseUserAdmin, ModelAdmin):
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'email',
                'rol',
                'password1',
                'password2',
                'is_active',
                'is_staff',
                'is_superadmin'
            ),
        }),
    )

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('email', 'rol')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superadmin')}),
    )

    
    list_display = ('username', 'email', 'rol', 'is_staff', 'is_superadmin')  

    # Asegurar que se use set_password()
    def save_model(self, request, obj, form, change):
        if not change:
            obj.set_password(form.cleaned_data['password1'])
        super().save_model(request, obj, form, change)

admin.site.register(User, UserAdmin)
    

    

