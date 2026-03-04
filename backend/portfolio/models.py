import hashlib
import os
import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.deconstruct import deconstructible
from django.utils.text import slugify


CATEGORY_ICON_SIZE = (64, 64)
CATEGORY_IMAGE_SIZE = (1200, 630)


@deconstructible
class ImageDimensionsValidator:
	def __init__(self, width, height, label):
		self.width = width
		self.height = height
		self.label = label

	def __call__(self, image):
		if not image:
			return

		if image.width != self.width or image.height != self.height:
			raise ValidationError(
				f"{self.label} deve ter exatamente {self.width}x{self.height}px."
			)


@deconstructible
class UploadWithUUID:
	def __init__(self, folder):
		self.folder = folder

	def __call__(self, instance, filename):
		extension = os.path.splitext(filename)[1].lower()
		return f"{self.folder}/{uuid.uuid4()}{extension}"


class TimeStampedModel(models.Model):
	created = models.DateTimeField(auto_now_add=True)
	update = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class Category(TimeStampedModel):
	name = models.CharField(max_length=100, unique=True)
	icon = models.ImageField(
		upload_to=UploadWithUUID("categories/icons"),
		null=True,
		validators=[ImageDimensionsValidator(CATEGORY_ICON_SIZE[0], CATEGORY_ICON_SIZE[1], "Ícone da categoria")],
		help_text=f"Tamanho recomendado/obrigatório: {CATEGORY_ICON_SIZE[0]}x{CATEGORY_ICON_SIZE[1]}px.",
	)
	image = models.ImageField(
		upload_to=UploadWithUUID("categories/images"),
		blank=True,
		null=True,
		validators=[ImageDimensionsValidator(CATEGORY_IMAGE_SIZE[0], CATEGORY_IMAGE_SIZE[1], "Imagem da categoria")],
		help_text=f"Tamanho recomendado/obrigatório: {CATEGORY_IMAGE_SIZE[0]}x{CATEGORY_IMAGE_SIZE[1]}px.",
	)
	hash = models.CharField(max_length=64, unique=True, editable=False)

	class Meta:
		verbose_name_plural = "categories"
		ordering = ["name"]

	def save(self, *args, **kwargs):
		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()
		return super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class Technology(TimeStampedModel):
	category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="technologies")
	name = models.CharField(max_length=100)
	slug = models.SlugField(max_length=140, unique=True, blank=True)
	hash = models.CharField(max_length=64, unique=True, editable=False)
	icon = models.CharField(
		max_length=60,
		blank=True,
		null=True,
		help_text='Informe o ícone do react-icons no formato "di/DiDjango" ou "si/SiReact".',
	)

	class Meta:
		unique_together = ("category", "name")
		ordering = ["name"]

	def save(self, *args, **kwargs):
		if not self.slug:
			base_slug = slugify(self.name)
			slug_candidate = base_slug
			index = 2
			while Technology.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
				slug_candidate = f"{base_slug}-{index}"
				index += 1
			self.slug = slug_candidate

		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()

		return super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class Project(TimeStampedModel):
	title = models.CharField(max_length=160)
	slug = models.SlugField(max_length=200, unique=True, blank=True)
	hash = models.CharField(max_length=64, unique=True, editable=False)
	descriptions_short = models.CharField(max_length=255)
	description = models.TextField()
	url = models.URLField(blank=True, null=True)
	repo_url = models.URLField(blank=True, null=True)
	thumbnall = models.ImageField(upload_to=UploadWithUUID("projects/thumbnails"), blank=True, null=True)
	technologies = models.ManyToManyField(Technology, related_name="projects", blank=True)
	featured = models.BooleanField(default=False)

	class Meta:
		ordering = ["-created"]

	def save(self, *args, **kwargs):
		if not self.slug:
			base_slug = slugify(self.title)
			slug_candidate = base_slug
			index = 2
			while Project.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
				slug_candidate = f"{base_slug}-{index}"
				index += 1
			self.slug = slug_candidate

		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()

		return super().save(*args, **kwargs)

	def __str__(self):
		return self.title


class Formation(TimeStampedModel):
	class FormationType(models.TextChoices):
		TECHNOLOGIST = "technologist", "Tecnólogo"
		GRADUATION = "graduation", "Graduação"
		POSTGRAD = "postgrad", "Pós-graduação"
		PROFESSIONAL_COURSE = "professional_course", "Curso profissionalizante"
		CERTIFICATION = "certification", "Certificação"

	title = models.CharField(max_length=180)
	slug = models.SlugField(max_length=220, unique=True, blank=True)
	hash = models.CharField(max_length=64, unique=True, editable=False)
	formation_type = models.CharField(max_length=30, choices=FormationType.choices)
	institution = models.CharField(max_length=180)
	area = models.CharField(max_length=120, blank=True, null=True)
	description = models.TextField(blank=True)
	start_date = models.DateField(blank=True, null=True)
	end_date = models.DateField(blank=True, null=True)
	is_in_progress = models.BooleanField(default=False)
	workload_hours = models.PositiveIntegerField(blank=True, null=True)
	credential_url = models.URLField(blank=True, null=True)
	featured = models.BooleanField(default=False)
	order = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ["-featured", "order", "-start_date", "-created"]

	def clean(self):
		super().clean()
		if self.start_date and self.end_date and self.end_date < self.start_date:
			raise ValidationError("A data final não pode ser menor que a data inicial.")

	def save(self, *args, **kwargs):
		if not self.slug:
			base_slug = slugify(self.title)
			slug_candidate = base_slug
			index = 2
			while Formation.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
				slug_candidate = f"{base_slug}-{index}"
				index += 1
			self.slug = slug_candidate

		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()

		return super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.title} - {self.institution}"


class ContactSubject(TimeStampedModel):
	name = models.CharField(max_length=120, unique=True)
	slug = models.SlugField(max_length=150, unique=True, blank=True)
	hash = models.CharField(max_length=64, unique=True, editable=False)
	is_active = models.BooleanField(default=True)
	order = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ["order", "name"]

	def save(self, *args, **kwargs):
		if not self.slug:
			base_slug = slugify(self.name)
			slug_candidate = base_slug
			index = 2
			while ContactSubject.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
				slug_candidate = f"{base_slug}-{index}"
				index += 1
			self.slug = slug_candidate

		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()

		return super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class ContactMessage(TimeStampedModel):
	class Status(models.TextChoices):
		NEW = "new", "Novo"
		IN_PROGRESS = "in_progress", "Em andamento"
		RESOLVED = "resolved", "Resolvido"

	hash = models.CharField(max_length=64, unique=True, editable=False)
	full_name = models.CharField(max_length=140)
	email = models.EmailField()
	phone = models.CharField(max_length=30)
	subject = models.ForeignKey(ContactSubject, on_delete=models.PROTECT, related_name="messages")
	message = models.TextField()
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
	privacy_consent = models.BooleanField(
		default=False,
		help_text="Indica se o usuário consentiu com a Política de Privacidade (LGPD)"
	)
	privacy_consent_date = models.DateTimeField(
		null=True,
		blank=True,
		help_text="Data e hora em que o consentimento foi registrado"
	)
	privacy_policy_version = models.CharField(
		max_length=20,
		default="1.0",
		help_text="Versão da Política de Privacidade aceita pelo usuário"
	)

	class Meta:
		ordering = ["-created"]

	def save(self, *args, **kwargs):
		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()
		# Define a data do consentimento se o usuário consentiu e a data ainda não foi registrada
		if self.privacy_consent and not self.privacy_consent_date:
			self.privacy_consent_date = timezone.now()
		return super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.full_name} - {self.subject.name}"


class ServiceRequest(TimeStampedModel):
	class Status(models.TextChoices):
		NEW = "new", "Novo"
		UNDER_REVIEW = "under_review", "Em análise"
		PROPOSAL_SENT = "proposal_sent", "Proposta enviada"
		REJECTED = "rejected", "Rejeitado"

	class BrandIdentityStatus(models.TextChoices):
		MANUAL = "manual", "Sim, tenho manual da marca"
		LOGO_ONLY = "logo_only", "Tenho apenas a logo"
		NONE = "none", "Ainda não tenho identidade visual"

	class Timeline(models.TextChoices):
		NO_RUSH = "no_rush", "Sem pressa"
		ONE_MONTH = "1_month", "1 mês"
		TWO_THREE_MONTHS = "2_3_months", "2–3 meses"
		MORE_THAN_THREE_MONTHS = "more_than_3_months", "Mais de 3 meses"
		URGENT = "urgent", "Urgente"

	class BudgetRange(models.TextChoices):
		UNKNOWN = "unknown", "Ainda não sei"
		ONE_TO_THREE = "1k_3k", "R$ 1k – 3k"
		THREE_TO_EIGHT = "3k_8k", "R$ 3k – 8k"
		EIGHT_TO_TWENTY = "8k_20k", "R$ 8k – 20k"
		TWENTY_PLUS = "20k_plus", "Acima de R$ 20k"

	hash = models.CharField(max_length=64, unique=True, editable=False)
	full_name = models.CharField(max_length=140)
	email = models.EmailField()
	phone = models.CharField(max_length=30)
	service_type = models.ForeignKey(ContactSubject, on_delete=models.PROTECT, related_name="service_requests")
	project_title = models.CharField(max_length=200)
	project_description = models.TextField()
	logo_image = models.ImageField(
		upload_to=UploadWithUUID("service-requests/logos"),
		blank=True,
		null=True,
	)
	brand_identity_status = models.CharField(
		max_length=30,
		choices=BrandIdentityStatus.choices,
		blank=True,
		null=True,
	)
	brand_manual_file = models.FileField(
		upload_to=UploadWithUUID("service-requests/brand-manuals"),
		blank=True,
		null=True,
	)
	reference_links = models.TextField(blank=True, null=True)
	primary_color = models.CharField(max_length=7, blank=True, null=True)
	secondary_color = models.CharField(max_length=7, blank=True, null=True)
	timeline = models.CharField(max_length=25, choices=Timeline.choices, blank=True, null=True)
	budget_range = models.CharField(
		max_length=20,
		choices=BudgetRange.choices,
		blank=True,
		null=True,
	)
	additional_info = models.TextField(blank=True, null=True)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
	privacy_consent = models.BooleanField(
		default=False,
		help_text="Indica se o usuário consentiu com a Política de Privacidade (LGPD)"
	)
	privacy_consent_date = models.DateTimeField(
		null=True,
		blank=True,
		help_text="Data e hora em que o consentimento foi registrado"
	)
	privacy_policy_version = models.CharField(
		max_length=20,
		default="1.0",
		help_text="Versão da Política de Privacidade aceita pelo usuário"
	)

	class Meta:
		ordering = ["-created"]

	def save(self, *args, **kwargs):
		if not self.hash:
			self.hash = hashlib.sha256(uuid.uuid4().hex.encode()).hexdigest()
		# Define a data do consentimento se o usuário consentiu e a data ainda não foi registrada
		if self.privacy_consent and not self.privacy_consent_date:
			self.privacy_consent_date = timezone.now()
		return super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.full_name} - {self.project_title}"

class AboutContent(TimeStampedModel):
	title = models.CharField(max_length=150, default="Sobre Mim")
	hero_image = models.ImageField(
		upload_to=UploadWithUUID("about"),
		blank=True,
		null=True,
		help_text="Imagem principal da seção Sobre Mim.",
	)

	class Meta:
		ordering = ["-update", "-created"]

	def __str__(self):
		return self.title
