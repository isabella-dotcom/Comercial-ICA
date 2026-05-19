-- ICA Comercial — schema Supabase
-- Execute no SQL Editor do Supabase (ou via CLI)

create extension if not exists "pgcrypto";

-- Perfis / usuários (CPF + PIN)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  cpf text unique not null,
  name text not null,
  role text not null check (role in ('growth', 'lana', 'ti', 'ceo')),
  label text not null,
  pin_hash text,
  created_at timestamptz not null default now()
);

create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  stages text[] not null,
  sort_order int not null default 0
);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references pipelines(id) on delete cascade,
  code text not null,
  name text not null,
  stage text not null,
  origin text,
  unit text,
  procedure text,
  value_display text default '—',
  value_cents integer,
  status text not null default 'Em andamento',
  active_label text default '—',
  notes text,
  owner_id uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pipeline_id, code)
);

create table if not exists card_history (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid references profiles(id),
  action text not null,
  details jsonb default '{}',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete set null,
  task_type text not null,
  owner_id uuid references profiles(id),
  status text not null default 'Pendente',
  task_date date not null,
  task_time time,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete set null,
  unit_key text not null,
  table_name text not null,
  payment_mode text not null,
  procedure_name text not null,
  value_display text,
  value_cents integer,
  status text not null default 'pre_montado',
  conditions text,
  internal_notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete set null,
  file_name text not null,
  file_path text not null,
  folder text default 'Pacientes',
  recipient_id uuid references profiles(id),
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete set null,
  sender text,
  recipient text,
  theme text,
  subject text,
  body text,
  budget_id uuid references budgets(id) on delete set null,
  sent_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  card_id uuid unique references cards(id) on delete cascade,
  channel text default 'WhatsApp',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  body text not null,
  sender_type text not null check (sender_type in ('user', 'contact')),
  channel text,
  sent_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id),
  request_type text not null,
  card_id uuid references cards(id) on delete set null,
  justification text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_cards_pipeline on cards(pipeline_id);
create index if not exists idx_cards_stage on cards(stage);
create index if not exists idx_tasks_card on tasks(card_id);
create index if not exists idx_messages_conversation on messages(conversation_id);

-- Storage: crie o bucket "documents" no painel Supabase (privado).

-- Funis padrão (estrutura operacional, sem leads de exemplo)
insert into pipelines (slug, name, stages, sort_order) values
  ('pacientes', 'Pacientes', array['Lead','Contato feito','Agendamento','Perda','Realizado'], 1),
  ('medicos', 'Médicos prescritores', array['Possível parceiro','Contato feito','Apresentação','Negociação','Parceria firmada','Declinou'], 2),
  ('parceiros', 'Parceiros', array['Possível parceiro','Contato feito','Apresentação','Negociação','Parceria firmada','Declinou'], 3)
on conflict (slug) do nothing;

-- Cadastre usuários reais antes do primeiro login (CPF só números, PIN no primeiro acesso):
--
-- insert into profiles (cpf, name, role, label) values
--   ('00000000000', 'Nome Completo', 'ti', 'TI/Admin');
--
-- Perfis: growth | lana | ti | ceo
