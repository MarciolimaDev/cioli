import json
import logging
from urllib import error, request

from django.conf import settings
from django.utils import timezone


logger = logging.getLogger(__name__)


def send_contact_message_notification(contact_message) -> None:
	webhook_url = getattr(settings, "DISCORD_CONTACT_WEBHOOK_URL", "").strip()
	if not webhook_url:
		return

	created_at = timezone.localtime(contact_message.created).strftime("%d/%m/%Y %H:%M")
	environment_label = "Desenvolvimento" if settings.DEBUG else "Produção"
	payload = {
		"username": "CIOLI - Contato",
		"content": "📩 Novo contato recebido pelo site",
		"embeds": [
			{
				"title": "Nova mensagem de contato",
				"color": 3447003,
				"fields": [
					{"name": "Ambiente", "value": environment_label, "inline": False},
					{"name": "Nome", "value": contact_message.full_name[:1024], "inline": False},
					{"name": "Email", "value": contact_message.email[:1024], "inline": False},
					{"name": "Telefone", "value": contact_message.phone[:1024], "inline": False},
					{"name": "Assunto", "value": contact_message.subject.name[:1024], "inline": False},
					{"name": "Mensagem", "value": contact_message.message[:1024], "inline": False},
					{"name": "Recebido em", "value": created_at, "inline": False},
				],
			}
		],
		"allowed_mentions": {"parse": []},
	}

	data = json.dumps(payload).encode("utf-8")
	webhook_request = request.Request(
		webhook_url,
		data=data,
		headers={
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0 (compatible; CIOLIWebhook/1.0; +https://cioli.dev)",
		},
		method="POST",
	)

	try:
		with request.urlopen(webhook_request, timeout=5):
			return
	except error.HTTPError as exc:
		response_body = exc.read().decode("utf-8", errors="replace")
		logger.warning(
			"Falha ao enviar notificação de contato para o Discord (HTTP %s): %s",
			exc.code,
			response_body,
		)
	except error.URLError as exc:
		logger.warning("Falha ao enviar notificação de contato para o Discord: %s", exc)


def send_service_request_notification(service_request) -> None:
	webhook_url = getattr(settings, "DISCORD_CONTACT_WEBHOOK_URL", "").strip()
	if not webhook_url:
		return

	created_at = timezone.localtime(service_request.created).strftime("%d/%m/%Y %H:%M")
	environment_label = "Desenvolvimento" if settings.DEBUG else "Produção"
	logo_value = "Não enviada"
	if getattr(service_request, "logo_image", None):
		logo_value = service_request.logo_image.name[:1024]
	brand_manual_value = "Não enviado"
	if getattr(service_request, "brand_manual_file", None):
		brand_manual_value = service_request.brand_manual_file.name[:1024]
	brand_identity_display = service_request.get_brand_identity_status_display() if service_request.brand_identity_status else "Não informado"
	timeline_display = service_request.get_timeline_display() if service_request.timeline else "Não informado"
	budget_display = service_request.get_budget_range_display() if service_request.budget_range else "Não informado"

	payload = {
		"username": "CIOLI - Contato",
		"content": "Novo formulario de servico recebido pelo site",
		"embeds": [
			{
				"title": "Nova solicitacao de servico",
				"color": 2003199,
				"fields": [
					{"name": "Ambiente", "value": environment_label, "inline": False},
					{"name": "Nome", "value": service_request.full_name[:1024], "inline": False},
					{"name": "Email", "value": service_request.email[:1024], "inline": False},
					{"name": "Telefone", "value": service_request.phone[:1024], "inline": False},
					{"name": "Tipo de serviço", "value": service_request.service_type.name[:1024], "inline": False},
					{"name": "Objetivo do projeto", "value": service_request.project_title[:1024], "inline": False},
					{"name": "Descrição", "value": service_request.project_description[:1024], "inline": False},
					{"name": "Logo", "value": logo_value, "inline": False},
					{"name": "Identidade visual", "value": brand_identity_display[:1024], "inline": False},
					{"name": "Manual da marca", "value": brand_manual_value, "inline": False},
					{
						"name": "Referências",
						"value": (service_request.reference_links or "Não informado")[:1024],
						"inline": False,
					},
					{
						"name": "Cores preferidas",
						"value": (
							f"Principal: {service_request.primary_color or 'Não informado'} | "
							f"Secundária: {service_request.secondary_color or 'Não informado'}"
						)[:1024],
						"inline": False,
					},
					{"name": "Prazo", "value": timeline_display[:1024], "inline": False},
					{"name": "Faixa de investimento", "value": budget_display[:1024], "inline": False},
					{
						"name": "Informações adicionais",
						"value": (service_request.additional_info or "Não informado")[:1024],
						"inline": False,
					},
					{"name": "Recebido em", "value": created_at, "inline": False},
				],
			}
		],
		"allowed_mentions": {"parse": []},
	}

	data = json.dumps(payload).encode("utf-8")
	webhook_request = request.Request(
		webhook_url,
		data=data,
		headers={
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0 (compatible; CIOLIWebhook/1.0; +https://cioli.dev)",
		},
		method="POST",
	)

	try:
		with request.urlopen(webhook_request, timeout=5):
			return
	except error.HTTPError as exc:
		response_body = exc.read().decode("utf-8", errors="replace")
		logger.warning(
			"Falha ao enviar notificação de solicitação de serviço para o Discord (HTTP %s): %s",
			exc.code,
			response_body,
		)
	except error.URLError as exc:
		logger.warning("Falha ao enviar notificação de solicitação de serviço para o Discord: %s", exc)
