# Ordem de execução no Supabase (SQL Editor)

Use **uma aba/query por arquivo**, nesta ordem:

## Banco novo (primeira vez)

1. `schema.sql` — todas as tabelas + funis  
2. `seed-prices.sql` — tabela de preços 2026  
3. Cadastre usuário em `profiles` (ver README)  
4. Storage: bucket privado `documents`

## Banco que já existia (produção)

1. **`migrate-price-tables.sql`** — cria `price_units`, `price_procedures`, `price_values`  
2. `cleanup-demo-data.sql` — remove cards/tarefas de demo (opcional)  
3. **`seed-prices.sql`** — importa preços LUX + CAC  

Se já rodou um `seed-prices.sql` antigo com linha de observação:

```sql
delete from price_procedures
where name ilike '%observação%' or name ilike '%observacao%';
```

Depois rode de novo o `seed-prices.sql` atualizado.

## Erro comum

| Erro | Causa | Solução |
|------|--------|---------|
| `relation "price_values" does not exist` | Tabelas de preço não criadas | Rode `migrate-price-tables.sql` primeiro |
| `CPF não encontrado` | Sem usuário em `profiles` | INSERT do seu CPF no README |
