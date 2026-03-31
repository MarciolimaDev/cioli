from django.contrib import admin

from .models import (
	AboutContent,
	Category,
	Client,
	ClientProject,
	ContactMessage,
	ContactSubject,
	Formation,
	Project,
	ProjectInstallment,
	ServiceRequest,
	Technology,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "hash", "created", "update")
	search_fields = ("name", "hash")


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "slug", "category", "hash", "created", "update")
	list_filter = ("category",)
	search_fields = ("name", "slug", "hash", "category__name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "slug", "featured", "hash", "created", "update")
	list_filter = ("featured",)
	search_fields = ("title", "slug", "hash", "descriptions_short")
	filter_horizontal = ("technologies",)


@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
	list_display = (
		"id",
		"title",
		"formation_type",
		"institution",
		"is_in_progress",
		"featured",
		"order",
		"created",
	)
	list_filter = ("formation_type", "is_in_progress", "featured")
	search_fields = ("title", "institution", "area", "slug", "hash")


@admin.register(ContactSubject)
class ContactSubjectAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "slug", "is_active", "order", "created")
	list_filter = ("is_active",)
	search_fields = ("name", "slug", "hash")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ("id", "full_name", "email", "phone", "subject", "status", "privacy_consent", "created")
	list_filter = ("status", "subject", "privacy_consent")
	search_fields = ("full_name", "email", "phone", "message", "hash")
	readonly_fields = ("hash", "privacy_consent_date", "created", "update")
	fieldsets = (
		("Informa\u00e7\u00f5es de Contato", {
			"fields": ("hash", "full_name", "email", "phone", "subject", "message", "status")
		}),
		("Consentimento LGPD", {
			"fields": ("privacy_consent", "privacy_consent_date", "privacy_policy_version"),
			"classes": ("collapse",),
		}),
		("Metadados", {
			"fields": ("created", "update"),
			"classes": ("collapse",),
		}),
	)


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "created", "update")
	search_fields = ("title",)


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
	list_display = ("id", "full_name", "email", "service_type", "project_title", "timeline", "budget_range", "status", "privacy_consent", "created")
	list_filter = ("status", "service_type", "privacy_consent")
	search_fields = ("full_name", "email", "phone", "project_title", "project_description", "reference_links", "hash")
	readonly_fields = ("hash", "privacy_consent_date", "created", "update")
	fieldsets = (
		("Informa\u00e7\u00f5es do Cliente", {
			"fields": ("hash", "full_name", "email", "phone", "service_type")
		}),
		("Informa\u00e7\u00f5es do Projeto", {
			"fields": (
				"project_title",
				"project_description",
				"logo_image",
				"brand_identity_status",
				"brand_manual_file",
				"reference_links",
				"primary_color",
				"secondary_color",
				"timeline",
				"budget_range",
				"additional_info",
				"status",
			)
		}),
		("Consentimento LGPD", {
			"fields": ("privacy_consent", "privacy_consent_date", "privacy_policy_version"),
			"classes": ("collapse",),
		}),
		("Metadados", {
			"fields": ("created", "update"),
			"classes": ("collapse",),
		}),
	)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "company_name", "email", "phone", "status", "created")
	list_filter = ("status",)
	search_fields = ("name", "company_name", "email", "phone", "hash", "document")


@admin.register(ClientProject)
class ClientProjectAdmin(admin.ModelAdmin):
	list_display = (
		"id",
		"title",
		"client",
		"service_type",
		"agreed_amount",
		"installments_count",
		"status",
		"start_date",
	)
	list_filter = ("status", "start_date")
	search_fields = ("title", "client__name", "client__company_name", "hash", "service_type")


@admin.register(ProjectInstallment)
class ProjectInstallmentAdmin(admin.ModelAdmin):
	list_display = (
		"id",
		"project",
		"installment_number",
		"amount",
		"due_date",
		"paid_amount",
		"paid_at",
		"created",
	)
	list_filter = ("due_date", "paid_at")
	search_fields = ("project__title", "project__client__name", "project__client__company_name", "hash")
