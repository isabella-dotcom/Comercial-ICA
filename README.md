# ICA Comercial

CRM comercial com autenticação por CPF + PIN, backend Supabase e deploy na Vercel.

## Stack

- **Frontend/API:** Next.js 16 (App Router)
- **Banco:** Supabase (PostgreSQL)
- **Arquivos:** Supabase Storage (bucket `documents`)
- **Hospedagem:** Vercel

## Configuração local

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No **SQL Editor**, execute o arquivo `supabase/schema.sql`
3. Em **Storage**, crie um bucket privado chamado `documents`
4. Copie URL e chaves em **Project Settings → API**

### 2. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AUTH_SECRET=uma_string_aleatoria_longa
```

Gere `AUTH_SECRET` com: `openssl rand -base64 32`

### 3. Rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Usuários de teste (após o seed SQL)

| CPF | Nome | Perfil |
|-----|------|--------|
| 101.920.726-41 | Gabriel | Head de Growth |
| 126.655.956-64 | Isabella | TI/Admin |
| 157.618.026-35 | Lana | Encantadora |
| 823.960.786-15 | Evaristo | CEO (somente leitura) |

No **Primeiro acesso**, cadastre um PIN de 6 dígitos (ex.: `147258`).

## Deploy na Vercel

1. Envie o repositório para GitHub
2. Importe o projeto na [Vercel](https://vercel.com) — pasta raiz: `ica-comercial`
3. Adicione as mesmas variáveis de ambiente do `.env.local`
4. Deploy

## Funcionalidades

- Login com CPF + PIN (hash bcrypt no servidor)
- Dashboard com métricas calculadas dos cards
- CRM Kanban (3 pipelines) com movimentação de etapas e histórico
- Tarefas, orçamentos (tabelas LUX/CAC), documentos, e-mails, mensagens
- Solicitações de aprovação (perfil Lana → Growth/TI)
- Permissões por perfil (CEO somente visualização)

## Estrutura

```
src/
  app/           # páginas e API routes
  components/    # UI (AppShell, Login)
  lib/           # auth, supabase, permissões, preços
supabase/
  schema.sql     # schema + seed
```
