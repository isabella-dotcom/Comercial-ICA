-- Remove dados de demonstração já inseridos pelo seed antigo.
-- Execute no SQL Editor do Supabase (ordem respeita FKs).

delete from price_values;
delete from price_procedures;
delete from price_units;

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
