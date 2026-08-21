# ClipForge Studio

Editor de vídeos para redes sociais com autenticação e persistência via Supabase.

## Desenvolvimento

```bash
npm install
cp .env.example .env
npm run dev
```

## Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o SQL Editor e execute, em ordem, os arquivos de `supabase/migrations/`.
3. Em Project Settings > API, copie a URL e a chave pública `anon` para `.env`.
4. Em Authentication > URL Configuration, adicione `http://localhost:5173/dashboard` às URLs de redirecionamento.
5. Para login com Google, habilite o provedor em Authentication > Providers e configure as credenciais OAuth.

Nunca coloque a chave `service_role` no front-end.

## Importação do YouTube

A importação aceita vídeos do YouTube que você possui ou tem autorização para processar. O navegador envia a URL para um serviço privado, que valida a sessão, executa `yt-dlp` e FFmpeg e grava o MP4 no bucket privado `project-media`.

### Desenvolvimento local

O serviço requer `yt-dlp` e FFmpeg instalados. A opção mais simples é executar o `server/Dockerfile`. Sem Docker, instale os dois binários no sistema e então:

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Preencha `server/.env` com a URL do projeto e a chave `service_role`. Essa chave deve existir somente no backend. O frontend usa `VITE_MEDIA_API_URL=http://localhost:8787` por padrão.

### Railway ou Render

1. Crie um serviço usando este repositório e defina `server` como diretório raiz.
2. Escolha deploy por Dockerfile.
3. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `ALLOWED_ORIGINS`.
4. Opcionalmente ajuste `MAX_VIDEO_DURATION_SECONDS`, `MAX_VIDEO_SIZE_MB` e `MAX_CONCURRENT_JOBS`.
5. Defina `VITE_MEDIA_API_URL` no build do frontend com a URL pública do serviço.

No Render, o arquivo `render.yaml` permite criar o serviço como Blueprint. Informe os segredos solicitados pelo painel e use `/health` para verificar a publicação.

Alguns IPs de datacenter são bloqueados pelo YouTube. Nesses casos, exporte cookies de uma conta autorizada no formato Netscape, converta o arquivo para Base64 e configure `YTDLP_COOKIES_BASE64` no backend. Nunca exponha essa variável ao frontend.

## Comandos

- `npm run dev`: inicia o servidor local.
- `npm run build`: valida os tipos e gera o bundle de produção.
- `npm run media:dev`: inicia o serviço local de processamento após configurar `server/.env`.
- `npm run preview`: serve o bundle de produção localmente.
