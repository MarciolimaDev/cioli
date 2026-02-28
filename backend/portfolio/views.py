from rest_framework import viewsets
from rest_framework.mixins import CreateModelMixin
from rest_framework.viewsets import GenericViewSet

from .models import AboutContent, Category, ContactSubject, Formation, Project, Technology
from .serializers import (
	AboutContentSerializer,
	CategorySerializer,
	ContactMessageSerializer,
	ContactSubjectSerializer,
	FormationSerializer,
	ProjectSerializer,
	TechnologySerializer,
)


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


class AboutContentViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = AboutContent.objects.all()
	serializer_class = AboutContentSerializer
