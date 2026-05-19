"""Gera supabase/seed-prices.sql a partir de prices-parsed.json."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "supabase" / "prices-parsed.json").read_text(encoding="utf-8"))


def esc(s: str | None) -> str:
    if s is None:
        return "null"
    return "'" + str(s).replace("'", "''") + "'"


def fmt_display(cents: int) -> str:
    reais = cents / 100
    txt = f"{reais:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {txt}"


lines: list[str] = [
    "-- Gerado a partir de Tabela de preços 2026.xlsx",
    "delete from price_values;",
    "delete from price_procedures;",
    "delete from price_units;",
    "",
    "insert into price_units (key, name, location, sort_order) values",
    "  ('lux', 'Hospital Luxemburgo (LUX BH)', 'Belo Horizonte', 1),",
    "  ('cac', 'Hospital Bom Samaritano (CAC GV)', 'Governador Valadares', 2)",
    "on conflict (key) do update set name = excluded.name, location = excluded.location;",
    "",
]

sort = 0
for unit_key, procedures in [("lux", data["lux"]), ("cac", data["cac"])]:
    for proc in procedures:
        sort += 1
        requires_quote = proc["requires_quote"] or not proc["prices"]
        synonyms = esc(proc["synonyms"]) if proc.get("synonyms") else "null"
        sigtap = (
            esc(proc["sigtap"])
            if proc.get("sigtap") and proc["sigtap"] not in ("-", "nan")
            else "null"
        )
        tuss = (
            esc(proc["tuss"])
            if proc.get("tuss") and proc["tuss"] not in ("-", "nan")
            else "null"
        )
        pname = esc(proc["name"])
        rq = "true" if requires_quote else "false"

        lines.append(f"-- {proc['name']} ({unit_key})")
        lines.append(
            "insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)"
        )
        lines.append(
            f"values ({esc(unit_key)}, {pname}, {synonyms}, {sigtap}, {tuss}, {rq}, {sort})"
        )
        lines.append(
            "on conflict (unit_key, name) do update set "
            "synonyms = excluded.synonyms, "
            "sigtap_code = excluded.sigtap_code, "
            "tuss_code = excluded.tuss_code, "
            "requires_quote = excluded.requires_quote, "
            "sort_order = excluded.sort_order;"
        )

        if proc["prices"]:
            value_rows: list[str] = []
            for table_name, modes in proc["prices"].items():
                for mode, cents in modes.items():
                    value_rows.append(
                        f"  ({esc(table_name)}, {esc(mode)}, {cents}, {esc(fmt_display(cents))})"
                    )
            lines.append(
                "insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)"
            )
            lines.append("select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display")
            lines.append("from price_procedures pr")
            lines.append("cross join lateral (values")
            lines.append(",\n".join(value_rows))
            lines.append(") as v(table_name, payment_mode, value_cents, value_display)")
            lines.append(f"where pr.unit_key = {esc(unit_key)} and pr.name = {pname};")
        lines.append("")

out = ROOT / "supabase" / "seed-prices.sql"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {out} ({sort} procedures)")
