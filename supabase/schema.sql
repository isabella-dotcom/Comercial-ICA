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

-- Storage bucket para documentos (criar no painel ou via API)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);

-- Seed usuários (PIN definido no primeiro acesso)
insert into profiles (cpf, name, role, label) values
  ('10192072641', 'Gabriel Oliveira de Jesus', 'growth', 'Head de Growth'),
  ('12665595664', 'Isabella Nogueira de Paulo', 'ti', 'TI/Admin'),
  ('15761802635', 'Lana Marie de Souza Barbosa', 'lana', 'Encantadora de Clientes'),
  ('82396078615', 'Evaristo Mascarenhas de Paula', 'ceo', 'CEO')
on conflict (cpf) do nothing;

insert into pipelines (slug, name, stages, sort_order) values
  ('pacientes', 'Pacientes', array['Lead','Contato feito','Agendamento','Perda','Realizado'], 1),
  ('medicos', 'Médicos prescritores', array['Possível parceiro','Contato feito','Apresentação','Negociação','Parceria firmada','Declinou'], 2),
  ('parceiros', 'Parceiros', array['Possível parceiro','Contato feito','Apresentação','Negociação','Parceria firmada','Declinou'], 3)
on conflict (slug) do nothing;

-- Cards seed (usa subselect de pipeline)
insert into cards (pipeline_id, code, name, stage, origin, unit, procedure, value_display, value_cents, status, active_label)
select p.id, v.code, v.name, v.stage, v.origin, v.unit, v.procedure, v.value_display, v.value_cents, v.status, v.active_label
from pipelines p
cross join lateral (values
  ('#482', 'Ana S.', 'Lead', 'Particular', 'LUX', 'Cateterismo Cardíaco', 'R$ 2.800,00', 280000, 'Em andamento', '2 dias'),
  ('#153', 'João M.', 'Contato feito', 'GCR', 'CAC', 'Angioplastia 1 stent', 'R$ 22.253,00', 2225300, 'Em andamento', '5 dias'),
  ('#771', 'Carlos R.', 'Agendamento', 'Indicação médica', 'HUCM', 'Aortografia', 'R$ 2.400,00', 240000, 'Em andamento', '1 dia'),
  ('#390', 'Maria P.', 'Perda', 'Particular', 'LUX', 'TAVI', 'Sob orçamento', null, 'Perdido', 'Perdido'),
  ('#245', 'Pedro A.', 'Realizado', 'Consórcio', 'CAC', 'Cateterismo Cardíaco', 'R$ 2.985,00', 298500, 'Ganho', 'Ganho')
) as v(code, name, stage, origin, unit, procedure, value_display, value_cents, status, active_label)
where p.slug = 'pacientes'
on conflict (pipeline_id, code) do nothing;

insert into cards (pipeline_id, code, name, stage, origin, unit, procedure, value_display, status, active_label)
select p.id, v.code, v.name, v.stage, v.origin, v.unit, v.procedure, v.value_display, v.status, v.active_label
from pipelines p
cross join lateral (values
  ('MED-021', 'Dr. Henrique', 'Possível parceiro', 'Paciente #482', 'LUX', 'Coronária', '—', 'Em andamento', '2 dias'),
  ('MED-045', 'Dra. Paula', 'Contato feito', 'Paciente #153', 'CAC', 'TAVI', '—', 'Em andamento', '3 dias'),
  ('MED-078', 'Dra. Renata', 'Negociação', 'Paciente #771', 'LUX', 'Eletrofisiologia', 'R$ 5.000,00', 'Em andamento', '8 dias'),
  ('MED-088', 'Dr. César', 'Parceria firmada', 'Growth', 'CAC', 'Coronária', '—', 'Ganho', 'Ganho')
) as v(code, name, stage, origin, unit, procedure, value_display, status, active_label)
where p.slug = 'medicos'
on conflict (pipeline_id, code) do nothing;

insert into cards (pipeline_id, code, name, stage, origin, unit, procedure, value_display, status, active_label)
select p.id, v.code, v.name, v.stage, v.origin, v.unit, v.procedure, v.value_display, v.status, v.active_label
from pipelines p
cross join lateral (values
  ('PAR-101', 'Clínica Alfa', 'Possível parceiro', 'Prospect', 'HUCM', 'Tabela: Social', '—', 'Em andamento', '1 dia'),
  ('PAR-105', 'Clínica Z', 'Parceria firmada', 'Growth', 'LUX', 'Contrato assinado', '—', 'Ganho', 'Ganho')
) as v(code, name, stage, origin, unit, procedure, value_display, status, active_label)
where p.slug = 'parceiros'
on conflict (pipeline_id, code) do nothing;

-- Tarefas seed
insert into tasks (card_id, task_type, status, task_date, task_time, notes)
select c.id, 'Ligação', 'Pendente', '2026-05-12'::date, '10:00'::time, 'Paciente #482'
from cards c where c.code = '#482'
on conflict do nothing;

-- Solicitações seed
insert into approval_requests (requester_id, request_type, card_id, justification, status)
select pr.id, 'Excluir card', c.id, 'Lead duplicado no pipeline de pacientes.', 'pending'
from profiles pr
join cards c on c.code = '#482'
where pr.role = 'lana'
limit 1;
