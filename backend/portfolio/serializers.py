from rest_framework import serializers

from .models import AboutContent, Category, ContactMessage, ContactSubject, Formation, Project, ServiceRequest, Technology


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "hash", "name", "icon", "image", "created", "update"]
        read_only_fields = ["id", "hash", "created", "update"]


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "hash", "category", "name", "slug", "icon", "created", "update"]
        read_only_fields = ["id", "hash", "slug", "created", "update"]


class ProjectTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["hash", "name", "slug", "icon"]
        read_only_fields = ["hash", "name", "slug", "icon"]


class ProjectSerializer(serializers.ModelSerializer):
    technologies = ProjectTechnologySerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        queryset=Technology.objects.all(),
        many=True,
        required=False,
        source="technologies",
        write_only=True,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "hash",
            "title",
            "slug",
            "descriptions_short",
            "description",
            "url",
            "repo_url",
            "thumbnall",
            "technologies",
            "technology_ids",
            "featured",
            "created",
            "update",
        ]
        read_only_fields = ["id", "hash", "slug", "created", "update"]


class FormationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = [
            "hash",
            "title",
            "slug",
            "formation_type",
            "institution",
            "area",
            "description",
            "start_date",
            "end_date",
            "is_in_progress",
            "workload_hours",
            "credential_url",
            "featured",
            "order",
            "created",
            "update",
        ]
        read_only_fields = ["hash", "slug", "created", "update"]


class ContactSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubject
        fields = ["hash", "name", "slug", "order", "is_active"]
        read_only_fields = ["hash", "slug"]


class ContactMessageSerializer(serializers.ModelSerializer):
    subject = serializers.SlugRelatedField(
        slug_field="hash",
        queryset=ContactSubject.objects.filter(is_active=True),
    )

    class Meta:
        model = ContactMessage
        fields = [
            "hash",
            "full_name",
            "email",
            "phone",
            "subject",
            "message",
            "status",
            "created",
            "update",
        ]
        read_only_fields = ["hash", "status", "created", "update"]


class AboutContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutContent
        fields = ["id", "title", "hero_image", "created", "update"]
        read_only_fields = ["id", "created", "update"]


class ServiceRequestSerializer(serializers.ModelSerializer):
    service_type = serializers.SlugRelatedField(
        slug_field="hash",
        queryset=ContactSubject.objects.filter(is_active=True),
    )

    class Meta:
        model = ServiceRequest
        fields = [
            "hash",
            "full_name",
            "email",
            "phone",
            "service_type",
            "project_title",
            "project_description",
            "logo_image",
            "additional_info",
            "status",
            "created",
            "update",
        ]
        read_only_fields = ["hash", "status", "created", "update"]
