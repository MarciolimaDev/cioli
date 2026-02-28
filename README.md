# CIOLI V2

Repositório único (monorepo) com:

- `frontend/` → Next.js 16 (App Router)
- `backend/` → Django + DRF

## Rodando localmente

### Frontend

```bash
npm install --prefix frontend
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Variáveis recomendadas (produção) estão em `backend/.env.example`.

## Deploy na Vercel (frontend)

Este repositório está preparado para deploy do frontend com configuração dentro de `frontend/vercel.json`.

### Passos

1. Suba este repositório no GitHub.
2. Na Vercel, clique em **Add New Project** e selecione o repositório.
3. Em **Root Directory**, selecione `frontend`.
4. A Vercel vai usar os comandos definidos em `frontend/vercel.json`.
5. Configure variáveis de ambiente se necessário (ex.: URL do backend).
6. Faça o deploy.

## Deploy na Fly (backend)

O backend já está preparado com:

- `backend/fly.toml`
- `backend/Dockerfile`
- `backend/.dockerignore`

### Passos

1. Entre na pasta do backend:

```bash
cd backend
```

2. Ajuste o nome do app em `fly.toml` (`app = "cioli-backend"`).

3. Crie o app (se ainda não existir):

```bash
flyctl apps create SEU_APP_NAME
```

4. Configure os secrets (exemplo):

```bash
flyctl secrets set DJANGO_SECRET_KEY=... DJANGO_DEBUG=False DJANGO_ALLOWED_HOSTS=SEU_APP_NAME.fly.dev CORS_ALLOWED_ORIGINS=https://SEU_FRONT.vercel.app CSRF_TRUSTED_ORIGINS=https://SEU_FRONT.vercel.app DATABASE_URL=postgresql://... DJANGO_USE_S3=True AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_STORAGE_BUCKET_NAME=... AWS_S3_REGION_NAME=sa-east-1
```

5. Faça deploy:

```bash
flyctl deploy
```
