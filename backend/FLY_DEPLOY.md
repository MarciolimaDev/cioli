# Deploy do Backend na Fly.io (passo a passo)

Este guia considera que seu backend Django está em `backend/` e já possui:

- `fly.toml`
- `Dockerfile`
- `requirements.txt`

## 0) Pré-requisitos

- Conta na Fly.io
- `flyctl` instalado
- Docker Desktop rodando (local)

## 1) Entrar na pasta do backend

```powershell
cd backend
```

## 2) Login na Fly

```powershell
flyctl auth login
```

## 3) Criar o app

Escolha um nome único (exemplo: `cioli-api-prod`).

```powershell
flyctl apps create cioli-api-prod
```

Depois, ajuste o `app` no `fly.toml` para o mesmo nome.

## 4) Definir secrets (produção)

> Troque os valores `...` pelos reais.

```powershell
flyctl secrets set \
DJANGO_SECRET_KEY="..." \
DJANGO_DEBUG="False" \
DJANGO_ALLOWED_HOSTS="cioli-api-prod.fly.dev" \
CORS_ALLOWED_ORIGINS="https://SEU_FRONT.vercel.app" \
CSRF_TRUSTED_ORIGINS="https://SEU_FRONT.vercel.app" \
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME" \
POSTGRES_SSLMODE="require" \
DJANGO_USE_S3="True" \
AWS_ACCESS_KEY_ID="..." \
AWS_SECRET_ACCESS_KEY="..." \
AWS_STORAGE_BUCKET_NAME="YOUR_BUCKET_NAME" \
AWS_S3_REGION_NAME="sa-east-1" \
AWS_LOCATION="YOUR_AWS_REGION"
```

## 5) Deploy

```powershell
flyctl deploy
```

## 6) Ver logs em tempo real

```powershell
flyctl logs
```

## 7) Testar API publicada

```powershell
curl https://cioli-api-prod.fly.dev/api/projects/
```

## 8) Atualizar frontend (Vercel)

Na Vercel, configure:

- `NEXT_API_URL=https://cioli-api-prod.fly.dev`

Se preferir, você pode usar também `https://cioli-api-prod.fly.dev/api`.

## Observações rápidas

- O `release_command` no `fly.toml` já roda `python manage.py migrate` a cada deploy.
- Se mudar domínio do frontend, atualize `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` com `flyctl secrets set` novamente.
