import hashlib
import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
	def create_user(self, email, first_name, last_name, cpf, phone, password=None, **extra_fields):
		if not email:
			raise ValueError("O email é obrigatório.")
		if not cpf:
			raise ValueError("O CPF é obrigatório.")

		email = self.normalize_email(email)
		user = self.model(
			email=email,
			first_name=first_name,
			last_name=last_name,
			cpf=cpf,
			phone=phone,
			**extra_fields,
		)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, first_name, last_name, cpf, phone, password=None, **extra_fields):
		extra_fields.setdefault("is_staff", True)
		extra_fields.setdefault("is_superuser", True)
		extra_fields.setdefault("is_active", True)

		if extra_fields.get("is_staff") is not True:
			raise ValueError("Superusuário precisa ter is_staff=True.")
		if extra_fields.get("is_superuser") is not True:
			raise ValueError("Superusuário precisa ter is_superuser=True.")

		return self.create_user(email, first_name, last_name, cpf, phone, password, **extra_fields)


class User(AbstractUser):
	username = None
	email = models.EmailField(unique=True)
	cpf = models.CharField(max_length=14, unique=True)
	phone = models.CharField(max_length=20)
	id_public = models.CharField(max_length=64, unique=True, editable=False)

	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = ["first_name", "last_name", "cpf", "phone"]

	objects = CustomUserManager()

	def save(self, *args, **kwargs):
		if not self.id_public:
			self.id_public = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()
		return super().save(*args, **kwargs)

	def __str__(self):
		return self.email
