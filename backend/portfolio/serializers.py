from rest_framework import serializers

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
            "privacy_consent",
            "privacy_consent_date",
            "privacy_policy_version",
            "created",
            "update",
        ]
        read_only_fields = ["hash", "status", "privacy_consent_date", "created", "update"]


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
            "brand_identity_status",
            "brand_manual_file",
            "reference_links",
            "primary_color",
            "secondary_color",
            "timeline",
            "budget_range",
            "additional_info",
            "status",
            "privacy_consent",
            "privacy_consent_date",
            "privacy_policy_version",
            "created",
            "update",
        ]
        read_only_fields = ["hash", "status", "privacy_consent_date", "created", "update"]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "id",
            "hash",
            "name",
            "slug",
            "company_name",
            "email",
            "phone",
            "document",
            "status",
            "notes",
            "created",
            "update",
        ]
        read_only_fields = ["id", "hash", "slug", "created", "update"]


class ClientProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.name", read_only=True)
    client_company_name = serializers.CharField(source="client.company_name", read_only=True)

    class Meta:
        model = ClientProject
        fields = [
            "id",
            "hash",
            "client",
            "client_name",
            "client_company_name",
            "title",
            "slug",
            "description",
            "service_type",
            "agreed_amount",
            "installments_count",
            "start_date",
            "status",
            "created",
            "update",
        ]
        read_only_fields = ["id", "hash", "slug", "created", "update"]


class ProjectInstallmentSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    client_name = serializers.CharField(source="project.client.name", read_only=True)
    client_company_name = serializers.CharField(
        source="project.client.company_name", read_only=True
    )
    is_paid = serializers.BooleanField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProjectInstallment
        fields = [
            "id",
            "hash",
            "project",
            "project_title",
            "client_name",
            "client_company_name",
            "installment_number",
            "description",
            "amount",
            "due_date",
            "paid_amount",
            "paid_at",
            "notes",
            "is_paid",
            "is_overdue",
            "created",
            "update",
        ]
        read_only_fields = [
            "id",
            "hash",
            "project_title",
            "client_name",
            "client_company_name",
            "is_paid",
            "is_overdue",
            "created",
            "update",
        ]
