from django.contrib import admin

from .models import AboutContent, Category, ContactMessage, ContactSubject, Formation, Project, Technology


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
	list_display = ("id", "full_name", "email", "phone", "subject", "status", "created")
	list_filter = ("status", "subject")
	search_fields = ("full_name", "email", "phone", "message", "hash")
	readonly_fields = ("hash", "created", "update")


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "created", "update")
	search_fields = ("title",)
