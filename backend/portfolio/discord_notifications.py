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
