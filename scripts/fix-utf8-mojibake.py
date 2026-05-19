"""Corrige texto UTF-8 lido/salvo como Latin-1 (mojibake)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/components/AppShell.tsx"

raw = TARGET.read_text(encoding="utf-8")

try:
    fixed = raw.encode("latin-1").decode("utf-8")
except UnicodeError:
    # Arquivo parcialmente corrompido: aplicar só trechos comuns
    replacements = {
        "OperaÃ§Ã£o": "Operação",
        "NavegaÃ§Ã£o": "Navegação",
        "OrÃ§amentos": "Orçamentos",
        "SolicitaÃ§Ãµes": "Solicitações",
        "ConfiguraÃ§Ãµes": "Configurações",
        "UsuÃ¡rios": "Usuários",
        "VisÃ£o": "Visão",
        "mÃ©dicos": "médicos",
        "cÃ¡lculo": "cálculo",
        "automÃ¡tico": "automático",
        "AprovaÃ§Ãµes": "Aprovações",
        "aÃ§Ãµes": "ações",
        "AdministraÃ§Ã£o": "Administração",
        "integraÃ§Ãµes": "integrações",
        "permissÃµes": "permissões",
        "SessÃ£o": "Sessão",
        "UsuÃ¡rio": "Usuário",
        "NegociaÃ§Ãµes": "Negociações",
        "Ãšltimas": "Últimas",
        "movimentaÃ§Ãµes": "movimentações",
        "ResponsÃ¡vel": "Responsável",
        "LigaÃ§Ã£o": "Ligação",
        "CaptaÃ§Ã£o": "Captação",
        "ReuniÃ£o": "Reunião",
        "prÃ©-montado": "pré-montado",
        "PrÃ©-montados": "Pré-montados",
        "MÃ©dicos": "Médicos",
        "DestinatÃ¡rio": "Destinatário",
        "AÃ§Ã£o": "Ação",
        "preÃ§o": "preço",
        "horÃ¡rio": "horário",
        "criaÃ§Ã£o": "criação",
        "exclusÃ£o": "exclusão",
        "ObservaÃ§Ã£o": "Observação",
        "solicitaÃ§Ã£o": "solicitação",
        "SolicitaÃ§Ã£o": "Solicitação",
        "Sem permissÃ£o": "Sem permissão",
        "Sem ediÃ§Ã£o": "Sem edição",
        "NÃ£o": "Não",
        "AÃ§Ãµes": "Ações",
        "solicitaÃ§Ãµes": "solicitações",
        "OrÃ§amento": "Orçamento",
        "Ã€ vista": "À vista",
        "Â·": "·",
    }
    fixed = raw
    for old, new in replacements.items():
        fixed = fixed.replace(old, new)
    # Ícones do menu (substituir sequências quebradas)
    nav_fixes = [
        ("â–£", "▣"),
        ("â–¦", "▦"),
        ("âœ\"", "✓"),
        ("â–¤", "▤"),
        ("âœ‰", "✉"),
        ("â—Œ", "◌"),
        ("âš ", "⚠ "),
        ("âš™", "⚙"),
        ("â—‰", "◉"),
    ]
    for old, new in nav_fixes:
        fixed = fixed.replace(old, new)

TARGET.write_text(fixed, encoding="utf-8")
print("OK:", TARGET)
