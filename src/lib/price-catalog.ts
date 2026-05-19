import type { PaymentMode } from "./prices";

export interface PriceCatalogProcedure {
  name: string;
  requiresQuote: boolean;
  tables: Record<string, Partial<Record<PaymentMode, string>>>;
}

export interface PriceCatalogUnit {
  key: string;
  name: string;
  location: string | null;
  tables: string[];
  procedures: PriceCatalogProcedure[];
}

export type PriceCatalog = Record<string, PriceCatalogUnit>;

type DbProcedure = {
  id: string;
  unit_key: string;
  name: string;
  requires_quote: boolean;
  sort_order: number;
};

type DbValue = {
  procedure_id: string;
  table_name: string;
  payment_mode: PaymentMode;
  value_display: string;
};

export function buildPriceCatalog(
  units: Array<{ key: string; name: string; location: string | null }>,
  procedures: DbProcedure[],
  values: DbValue[]
): PriceCatalog {
  const valuesByProcedure = new Map<string, DbValue[]>();
  for (const value of values) {
    const list = valuesByProcedure.get(value.procedure_id) ?? [];
    list.push(value);
    valuesByProcedure.set(value.procedure_id, list);
  }

  const catalog: PriceCatalog = {};

  for (const unit of units) {
    const unitProcedures = procedures
      .filter((p) => p.unit_key === unit.key)
      .sort((a, b) => a.sort_order - b.sort_order);

    const tableSet = new Set<string>();
    const procList: PriceCatalogProcedure[] = [];

    for (const proc of unitProcedures) {
      const tables: Record<string, Partial<Record<PaymentMode, string>>> = {};
      for (const val of valuesByProcedure.get(proc.id) ?? []) {
        tableSet.add(val.table_name);
        tables[val.table_name] ??= {};
        tables[val.table_name][val.payment_mode] = val.value_display;
      }
      procList.push({
        name: proc.name,
        requiresQuote: proc.requires_quote,
        tables,
      });
    }

    catalog[unit.key] = {
      key: unit.key,
      name: unit.name,
      location: unit.location,
      tables: Array.from(tableSet),
      procedures: procList,
    };
  }

  return catalog;
}

export function calculatePriceFromCatalog(
  catalog: PriceCatalog,
  unitKey: string,
  table: string,
  mode: PaymentMode,
  procedureName: string
): { value: string; requiresQuote: boolean } {
  const unit = catalog[unitKey];
  if (!unit) return { value: "Unidade não encontrada", requiresQuote: false };

  const proc = unit.procedures.find((p) => p.name === procedureName);
  if (!proc) return { value: "Procedimento não encontrado", requiresQuote: false };
  if (proc.requiresQuote) {
    return { value: "É necessário solicitar orçamento", requiresQuote: true };
  }

  const price = proc.tables[table]?.[mode];
  if (!price) return { value: "Tabela não configurada", requiresQuote: false };
  return { value: price, requiresQuote: false };
}

export function getProcedureNames(catalog: PriceCatalog, unitKey: string): string[] {
  return catalog[unitKey]?.procedures.map((p) => p.name) ?? [];
}

export function getTableNames(catalog: PriceCatalog, unitKey: string): string[] {
  return catalog[unitKey]?.tables ?? [];
}
