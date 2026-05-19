-- Execute PRIMEIRO se o banco já existia antes das tabelas de preço.
-- Cria price_units, price_procedures e price_values.

create table if not exists price_units (
  key text primary key,
  name text not null,
  location text,
  sort_order int not null default 0
);

create table if not exists price_procedures (
  id uuid primary key default gen_random_uuid(),
  unit_key text not null references price_units(key) on delete cascade,
  name text not null,
  synonyms text,
  sigtap_code text,
  tuss_code text,
  requires_quote boolean not null default false,
  sort_order int not null default 0,
  unique (unit_key, name)
);

create table if not exists price_values (
  id uuid primary key default gen_random_uuid(),
  procedure_id uuid not null references price_procedures(id) on delete cascade,
  table_name text not null,
  payment_mode text not null check (payment_mode in ('avista', 'parcelado')),
  value_cents integer,
  value_display text not null,
  unique (procedure_id, table_name, payment_mode)
);

create index if not exists idx_price_procedures_unit on price_procedures(unit_key);
create index if not exists idx_price_values_procedure on price_values(procedure_id);
