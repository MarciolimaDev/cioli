from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
	model = User
	list_display = ("id", "id_public", "email", "first_name", "last_name", "cpf", "phone", "is_staff")
	ordering = ("email",)
	search_fields = ("email", "first_name", "last_name", "cpf", "phone", "id_public")

	fieldsets = (
		(None, {"fields": ("email", "password")} ),
		("Informações pessoais", {"fields": ("first_name", "last_name", "cpf", "phone", "id_public")} ),
		("Permissões", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")} ),
		("Datas importantes", {"fields": ("last_login", "date_joined")} ),
	)

	add_fieldsets = (
		(
			None,
			{
				"classes": ("wide",),
				"fields": ("email", "first_name", "last_name", "cpf", "phone", "password1", "password2", "is_staff", "is_superuser"),
			},
		),
	)

	readonly_fields = ("id_public",)
