import json
import logging
import re
import time
from urllib import error, request as urllib_request

from django.conf import settings
from django.core.cache import cache


logger = logging.getLogger(__name__)


SUSPICIOUS_PATH_TOKENS = (
	"wp-admin",
	"wp-login",
	"xmlrpc.php",
	"phpmyadmin",
	".env",
	"/boaform/",
	"/cgi-bin/",
	"/.git",
	"/autodiscover/",
)

SUSPICIOUS_PAYLOAD_PATTERNS = (
	re.compile(r"(?i)(\bunion\b\s+\bselect\b|\bor\b\s+1=1|\bdrop\s+table\b|--|/\*|\bselect\b.+\bfrom\b)"),
	re.compile(r"(?i)(<script|javascript:|onerror=|onload=|<img[^>]+onerror=)"),
	re.compile(r"(?i)(<!doctype|<!entity|system\s+\"|system\s+')"),
)


def _get_client_ip(request) -> str:
	xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
	if xff:
		return xff.split(",")[0].strip()
	return request.META.get("REMOTE_ADDR", "unknown")


def _build_webhook_url() -> str:
	security_webhook = getattr(settings, "DISCORD_SECURITY_WEBHOOK_URL", "").strip()
	if security_webhook:
		return security_webhook
	return getattr(settings, "DISCORD_CONTACT_WEBHOOK_URL", "").strip()


def _send_security_alert(title: str, fields: list[dict]) -> None:
	webhook_url = _build_webhook_url()
	if not webhook_url:
		return

	environment_label = "Desenvolvimento" if settings.DEBUG else "Produção"
	payload = {
		"username": "CIOLI - Security Monitor",
		"content": "🚨 Evento de segurança detectado",
		"embeds": [
			{
				"title": title,
				"color": 15158332,
				"fields": [
					{"name": "Ambiente", "value": environment_label, "inline": False},
					*fields,
				],
			}
		],
		"allowed_mentions": {"parse": []},
	}

	webhook_request = urllib_request.Request(
		webhook_url,
		data=json.dumps(payload).encode("utf-8"),
		headers={
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0 (compatible; CIOLISecurityMonitor/1.0; +https://cioli.dev)",
		},
		method="POST",
	)

	try:
		with urllib_request.urlopen(webhook_request, timeout=5):
			return
	except error.HTTPError as exc:
		response_body = exc.read().decode("utf-8", errors="replace")
		logger.warning(
			"Falha ao enviar alerta de segurança para o Discord (HTTP %s): %s",
			exc.code,
			response_body,
		)
	except error.URLError as exc:
		logger.warning("Falha ao enviar alerta de segurança para o Discord: %s", exc)


def _emit_once(key: str, timeout_seconds: int) -> bool:
	return cache.add(key, 1, timeout=timeout_seconds)


class SecurityMonitoringMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		try:
			if getattr(settings, "SECURITY_ALERTS_ENABLED", True):
				self._inspect_request(request)
		except Exception as exc:
			logger.warning("Falha no monitoramento de segurança: %s", exc)

		return self.get_response(request)

	def _inspect_request(self, request):
		ip_address = _get_client_ip(request)
		path = request.path.lower()

		for token in SUSPICIOUS_PATH_TOKENS:
			if token in path:
				cache_key = f"security:path:{ip_address}:{token}"
				if _emit_once(cache_key, timeout_seconds=900):
					_send_security_alert(
						"Tentativa de varredura de rotas",
						[
							{"name": "IP", "value": ip_address[:1024], "inline": False},
							{"name": "Path", "value": request.path[:1024], "inline": False},
							{"name": "Método", "value": request.method[:1024], "inline": False},
						],
					)
				break

		rate_limit = max(getattr(settings, "SECURITY_ALERTS_RATE_LIMIT_PER_MINUTE", 120), 30)
		minute_bucket = int(time.time() // 60)
		count_key = f"security:req_count:{ip_address}:{minute_bucket}"

		if cache.add(count_key, 1, timeout=80):
			request_count = 1
		else:
			try:
				request_count = cache.incr(count_key)
			except ValueError:
				cache.set(count_key, 1, timeout=80)
				request_count = 1

		if request_count == rate_limit:
			_send_security_alert(
				"Pico anormal de requisições (possível DDoS)",
				[
					{"name": "IP", "value": ip_address[:1024], "inline": False},
					{"name": "Requisições/min", "value": str(request_count), "inline": False},
					{"name": "Path atual", "value": request.path[:1024], "inline": False},
				],
			)

		if request.method not in {"POST", "PUT", "PATCH", "DELETE"}:
			return

		query_text = request.META.get("QUERY_STRING", "")[:2000]
		body_text = ""
		raw_body = request.body[:4000]
		if raw_body:
			body_text = raw_body.decode("utf-8", errors="replace")

		combined_text = f"{query_text}\n{body_text}".strip()
		if not combined_text:
			return

		for pattern in SUSPICIOUS_PAYLOAD_PATTERNS:
			if pattern.search(combined_text):
				cache_key = f"security:payload:{ip_address}:{pattern.pattern}:{minute_bucket}"
				if _emit_once(cache_key, timeout_seconds=300):
					snippet = combined_text[:500]
					_send_security_alert(
						"Payload suspeito detectado",
						[
							{"name": "IP", "value": ip_address[:1024], "inline": False},
							{"name": "Path", "value": request.path[:1024], "inline": False},
							{"name": "Método", "value": request.method[:1024], "inline": False},
							{"name": "Amostra", "value": snippet[:1024] or "(vazio)", "inline": False},
						],
					)
				break
