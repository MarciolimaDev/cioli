const FALLBACK_BACKEND_URL = "http://127.0.0.1:8000";

function removeTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getBackendConfig() {
  const envBase = process.env.NEXT_API_URL?.trim() || FALLBACK_BACKEND_URL;
  const normalizedBase = removeTrailingSlash(envBase);

  const apiBase = normalizedBase.endsWith("/api")
    ? normalizedBase
    : `${normalizedBase}/api`;

  const origin = normalizedBase.endsWith("/api")
    ? normalizedBase.slice(0, -4)
    : normalizedBase;

  return { origin, apiBase };
}

export function buildBackendApiUrl(path: string) {
  const { apiBase } = getBackendConfig();
  const normalizedPath = path.replace(/^\/+/, "");
  return `${apiBase}/${normalizedPath}`;
}

export function buildBackendAbsoluteUrl(path: string) {
  const { origin } = getBackendConfig();

  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}