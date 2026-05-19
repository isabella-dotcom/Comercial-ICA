from pathlib import Path

path = Path(__file__).resolve().parents[1] / "src/components/AppShell.tsx"
text = path.read_text(encoding="utf-8")
replacements = [
    ("OlÃ¡", "Ol\u00e1"),
    ("orÃ§amento", "or\u00e7amento"),
    ("HorÃ¡rio", "Hor\u00e1rio"),
    ("\u00e2\u2020\u2019", "\u2192"),
    ("\u00e2\u20ac\u201d", "\u2014"),
    ("nÃ£o", "n\u00e3o"),
    ("preÃ§os", "pre\u00e7os"),
]
for old, new in replacements:
    text = text.replace(old, new)
path.write_text(text, encoding="utf-8")
print("encoding fixed")
