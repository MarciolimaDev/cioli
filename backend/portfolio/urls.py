from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AboutContentViewSet,
    CategoryViewSet,
    ContactMessageViewSet,
    ContactSubjectViewSet,
    FormationViewSet,
    ProjectViewSet,
    TechnologyViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("technologies", TechnologyViewSet, basename="technology")
router.register("projects", ProjectViewSet, basename="project")
router.register("formations", FormationViewSet, basename="formation")
router.register("contact-subjects", ContactSubjectViewSet, basename="contact-subject")
router.register("contact-messages", ContactMessageViewSet, basename="contact-message")
router.register("about-content", AboutContentViewSet, basename="about-content")

urlpatterns = [
    path("", include(router.urls)),
]
