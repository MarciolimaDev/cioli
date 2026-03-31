# Generated manually for financial management models.

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0014_servicerequest_brand_identity_status_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Client",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("update", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=180)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("hash", models.CharField(editable=False, max_length=64, unique=True)),
                ("company_name", models.CharField(blank=True, max_length=180, null=True)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=30, null=True)),
                ("document", models.CharField(blank=True, max_length=30, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[("lead", "Lead"), ("active", "Ativo"), ("inactive", "Inativo")],
                        default="active",
                        max_length=20,
                    ),
                ),
                ("notes", models.TextField(blank=True)),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="ClientProject",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("update", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=180)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("hash", models.CharField(editable=False, max_length=64, unique=True)),
                ("description", models.TextField(blank=True)),
                ("service_type", models.CharField(blank=True, max_length=120, null=True)),
                ("agreed_amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("installments_count", models.PositiveIntegerField(default=1)),
                ("start_date", models.DateField(default=django.utils.timezone.localdate)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("proposal", "Proposta"),
                            ("active", "Em execucao"),
                            ("completed", "Concluido"),
                            ("cancelled", "Cancelado"),
                        ],
                        default="active",
                        max_length=20,
                    ),
                ),
                (
                    "client",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="projects",
                        to="portfolio.client",
                    ),
                ),
            ],
            options={
                "ordering": ["-created"],
            },
        ),
        migrations.CreateModel(
            name="ProjectInstallment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("update", models.DateTimeField(auto_now=True)),
                ("hash", models.CharField(editable=False, max_length=64, unique=True)),
                ("installment_number", models.PositiveIntegerField()),
                ("description", models.CharField(blank=True, max_length=180)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("due_date", models.DateField()),
                ("paid_amount", models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ("paid_at", models.DateField(blank=True, null=True)),
                ("notes", models.TextField(blank=True)),
                (
                    "project",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="installments",
                        to="portfolio.clientproject",
                    ),
                ),
            ],
            options={
                "ordering": ["due_date", "installment_number"],
                "unique_together": {("project", "installment_number")},
            },
        ),
    ]
