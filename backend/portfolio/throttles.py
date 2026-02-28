from rest_framework.throttling import SimpleRateThrottle


class ContactMessageRateThrottle(SimpleRateThrottle):
	scope = "contact_message_submit"
	cache_format = "throttle_%(scope)s_%(ident)s"
	message = "Muitas tentativas de envio. Aguarde um pouco e tente novamente."

	def get_cache_key(self, request, view):
		ident = self.get_ident(request)
		return self.cache_format % {"scope": self.scope, "ident": ident}
