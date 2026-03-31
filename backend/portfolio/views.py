from django.db.models import DecimalField, Sum, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from .models import (
	AboutContent,
	Category,
	Client,
	ClientProject,
	ContactSubject,
	Formation,
	Project,
	ProjectInstallment,
	ServiceRequest,
	Technology,
)
from .throttles import ContactMessageRateThrottle
from .serializers import (
	AboutContentSerializer,
	CategorySerializer,
	ClientProjectSerializer,
	ClientSerializer,
	ContactMessageSerializer,
	ContactSubjectSerializer,
	FormationSerializer,
	ProjectSerializer,
	ProjectInstallmentSerializer,
	ServiceRequestSerializer,
	TechnologySerializer,
)
from .discord_notifications import send_contact_message_notification, send_service_request_notification


class CategoryViewSet(viewsets.ModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer


class TechnologyViewSet(viewsets.ModelViewSet):
	queryset = Technology.objects.select_related("category").all()
	serializer_class = TechnologySerializer


class ProjectViewSet(viewsets.ModelViewSet):
	queryset = Project.objects.prefetch_related("technologies").all()
	serializer_class = ProjectSerializer


class FormationViewSet(viewsets.ModelViewSet):
	queryset = Formation.objects.all()
	serializer_class = FormationSerializer


class ContactSubjectViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = ContactSubject.objects.filter(is_active=True)
	serializer_class = ContactSubjectSerializer


class ContactMessageViewSet(CreateModelMixin, GenericViewSet):
	serializer_class = ContactMessageSerializer
	throttle_classes = [ContactMessageRateThrottle]

	def perform_create(self, serializer):
		contact_message = serializer.save()
		send_contact_message_notification(contact_message)


class AboutContentViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = AboutContent.objects.all()
	serializer_class = AboutContentSerializer


class ServiceRequestViewSet(CreateModelMixin, GenericViewSet):
	serializer_class = ServiceRequestSerializer
	throttle_classes = [ContactMessageRateThrottle]

	def perform_create(self, serializer):
		service_request = serializer.save()
		send_service_request_notification(service_request)


class ClientViewSet(viewsets.ModelViewSet):
	queryset = Client.objects.all()
	serializer_class = ClientSerializer


class ClientProjectViewSet(viewsets.ModelViewSet):
	queryset = ClientProject.objects.select_related("client").all()
	serializer_class = ClientProjectSerializer


class ProjectInstallmentViewSet(viewsets.ModelViewSet):
	queryset = ProjectInstallment.objects.select_related("project", "project__client").all()
	serializer_class = ProjectInstallmentSerializer


class FinanceSummaryView(APIView):
	def get(self, request):
		today = timezone.localdate()
		installments = ProjectInstallment.objects.select_related("project", "project__client")
		zero_amount = Value(0, output_field=DecimalField(max_digits=12, decimal_places=2))

		total_billed = installments.aggregate(
			value=Coalesce(Sum("amount"), zero_amount)
		)["value"]
		total_received = installments.filter(paid_at__isnull=False).aggregate(
			value=Coalesce(Sum("paid_amount"), zero_amount)
		)["value"]
		total_pending = installments.filter(
			paid_at__isnull=True,
			due_date__gte=today,
		).aggregate(value=Coalesce(Sum("amount"), zero_amount))["value"]
		total_overdue = installments.filter(
			paid_at__isnull=True,
			due_date__lt=today,
		).aggregate(value=Coalesce(Sum("amount"), zero_amount))["value"]
		total_due_today = installments.filter(
			paid_at__isnull=True,
			due_date=today,
		).aggregate(value=Coalesce(Sum("amount"), zero_amount))["value"]

		recent_installments = installments.filter(
			paid_at__isnull=True
		).order_by("due_date", "installment_number")[:5]
		recent_payments = installments.filter(paid_at__isnull=False).order_by("-paid_at")[:5]

		return Response(
			{
				"summary": {
					"clients_count": Client.objects.count(),
					"projects_count": ClientProject.objects.count(),
					"installments_count": installments.count(),
					"total_billed": total_billed,
					"total_received": total_received,
					"total_pending": total_pending,
					"total_overdue": total_overdue,
					"total_due_today": total_due_today,
				},
				"upcoming_installments": ProjectInstallmentSerializer(
					recent_installments, many=True
				).data,
				"recent_payments": ProjectInstallmentSerializer(
					recent_payments, many=True
				).data,
			}
		)
