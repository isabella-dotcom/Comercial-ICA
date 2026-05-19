-- Remove dados de demonstração (CRM). Seguro mesmo se tabelas de preço ainda não existirem.
-- Ordem: 1) migrate-price-tables.sql  2) cleanup (este)  3) seed-prices.sql

do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'price_values') then
    delete from price_values;
  end if;
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'price_procedures') then
    delete from price_procedures;
  end if;
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'price_units') then
    delete from price_units;
  end if;
end $$;

delete from approval_requests;
delete from messages;
delete from conversations;
delete from emails;
delete from documents;
delete from budgets;
delete from tasks;
delete from card_history;
delete from cards;

-- Opcional: remover usuários fictícios do seed antigo
-- delete from profiles
-- where cpf in (
--   '10192072641',
--   '12665595664',
--   '15761802635',
--   '82396078615'
-- );
