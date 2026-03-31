from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AboutContentViewSet,
    CategoryViewSet,
    ClientProjectViewSet,
    ClientViewSet,
    ContactMessageViewSet,
    ContactSubjectViewSet,
    FinanceSummaryView,
    FormationViewSet,
    ProjectViewSet,
    ProjectInstallmentViewSet,
    ServiceRequestViewSet,
    TechnologyViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("technologies", TechnologyViewSet, basename="technology")
router.register("projects", ProjectViewSet, basename="project")
router.register("formations", FormationViewSet, basename="formation")
router.register("contact-subjects", ContactSubjectViewSet, basename="contact-subject")
router.register("contact-messages", ContactMessageViewSet, basename="contact-message")
router.register("service-requests", ServiceRequestViewSet, basename="service-request")
router.register("about-content", AboutContentViewSet, basename="about-content")
router.register("clients", ClientViewSet, basename="client")
router.register("client-projects", ClientProjectViewSet, basename="client-project")
router.register("project-installments", ProjectInstallmentViewSet, basename="project-installment")

urlpatterns = [
    path("finance-summary/", FinanceSummaryView.as_view(), name="finance-summary"),
    path("", include(router.urls)),
]
