"""Lê o Excel e gera supabase/prices-parsed.json."""
import json
import re
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = Path(r"c:\Users\guilh\Downloads\Tabela de preços 2026.xlsx")


def parse_money(value) -> int | str | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, str):
        text = value.strip()
        if not text or text == "-":
            return None
        if "solicitar" in text.lower():
            return "QUOTE"
        cleaned = re.sub(r"[^\d,\.]", "", text)
        if not cleaned:
            return None
        cleaned = cleaned.replace(".", "").replace(",", ".")
        return int(round(float(cleaned) * 100))
    if isinstance(value, (int, float)) and not pd.isna(value):
        return int(round(float(value) * 100))
    return None


def parse_sheet(df: pd.DataFrame, column_groups: list[tuple[int, int, str]]) -> list[dict]:
    procedures: list[dict] = []
    for row_idx in range(6, len(df)):
        name = df.iloc[row_idx, 1]
        if pd.isna(name):
            continue
        name = str(name).strip()
        if not name:
            continue
        lower = name.lower()
        if name.startswith("*") or "observação" in lower or "observacao" in lower:
            continue
        if lower.startswith("procedimento"):
            continue

        synonyms = df.iloc[row_idx, 2]
        synonyms = None if pd.isna(synonyms) else str(synonyms).strip()
        sigtap = df.iloc[row_idx, 3]
        sigtap = None if pd.isna(sigtap) else str(sigtap).strip()
        tuss = df.iloc[row_idx, 4]
        tuss = None if pd.isna(tuss) else str(tuss).strip()

        prices: dict[str, dict[str, int]] = {}
        requires_quote = False

        for av_col, par_col, table_name in column_groups:
            avista = parse_money(df.iloc[row_idx, av_col])
            parcelado = parse_money(df.iloc[row_idx, par_col])
            if avista == "QUOTE" or parcelado == "QUOTE":
                requires_quote = True
            if isinstance(avista, int):
                prices.setdefault(table_name, {})["avista"] = avista
            if isinstance(parcelado, int):
                prices.setdefault(table_name, {})["parcelado"] = parcelado

        for col_idx, _par_col, _table in column_groups:
            cell = df.iloc[row_idx, col_idx]
            if isinstance(cell, str) and "solicitar" in cell.lower():
                requires_quote = True

        if requires_quote and not prices:
            requires_quote = True

        procedures.append(
            {
                "name": name,
                "synonyms": synonyms,
                "sigtap": sigtap,
                "tuss": tuss,
                "requires_quote": requires_quote,
                "prices": prices,
            }
        )
    return procedures


def main(xlsx_path: Path = DEFAULT_XLSX) -> None:
    lux_df = pd.read_excel(xlsx_path, sheet_name=0, header=None)
    cac_df = pd.read_excel(xlsx_path, sheet_name=1, header=None)

    lux = parse_sheet(
        lux_df,
        [
            (5, 6, "Social"),
            (7, 8, "Clínicas"),
            (9, 10, "Particular"),
        ],
    )
    cac = parse_sheet(
        cac_df,
        [
            (5, 6, "Social"),
            (7, 8, "Parcerias"),
            (9, 10, "Particular balcão"),
            (11, 12, "GCR"),
        ],
    )

    out = ROOT / "supabase" / "prices-parsed.json"
    out.write_text(
        json.dumps({"lux": lux, "cac": cac}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"LUX: {len(lux)} procedimentos | CAC: {len(cac)} procedimentos -> {out}")


if __name__ == "__main__":
    main()
