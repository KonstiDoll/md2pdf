# md2pdf Setup

## 🛠️ Installation

1. **Tool installieren:**
   ```bash
   npm install
   ```

2. **Konfiguration erstellen:**
   ```bash
   cp config.template.json config.json
   ```

3. **config.json anpassen:**
   Bearbeiten Sie die `config.json` Datei mit Ihren Firmendaten:
   
   ```json
   {
     "company": {
       "name": "Ihr Firmenname",
       "address": "Ihre Adresse",
       "city": "Ihre Stadt",
       "ustId": "Ihre USt-ID",
       "email": "ihre@email.de",
       "phone": "+49 xxx xxxxxxx",
       "website": "ihre-website.de"
     },
     "bank": {
       "name": "Ihre Bank",
       "iban": "Ihre IBAN",
       "bic": "Ihr BIC/SWIFT"
     },
     "colors": {
       "primary": "#your-primary-color",
       "text": "#your-text-color"
     },
     "logo": {
       "file": "logo.svg",
       "width": "80px"
     }
   }
   ```

## 📝 Angebots-Format

Für den `--angebot` Modus verwenden Sie dieses Format am Anfang Ihrer Markdown-Datei:

```markdown
**Auftraggeber:** Kunde GmbH
**Adresse:** Kundenstraße 1, 12345 Stadt, Deutschland
**Angebotssteller:** Ihr Firmenname
**Datum:** 20. Juni 2025
**Gültigkeitsdauer:** 30 Tage
**Angebotsnummer:** PROJEKT-2025-001

# Ihr Angebots-Titel

Hier kommt der Inhalt Ihres Angebots...
```

## 🚀 Verwendung

```bash
# Normales PDF
md2pdf dokument.md

# Professionelles Angebot
md2pdf angebot.md --angebot

# Ohne automatisches Öffnen
md2pdf angebot.md --angebot --no-open
```

## 🎨 Logo hinzufügen

1. Speichern Sie Ihr Logo als SVG-Datei (z.B. `logo.svg`) im gleichen Verzeichnis wie das Tool
2. Geben Sie in der `config.json` unter `logo.file` den Dateinamen an
3. Das Tool lädt die SVG-Datei automatisch

**Beispiel:**
- Logo-Datei: `mein-logo.svg`
- In config.json: `"file": "mein-logo.svg"`

## 🔒 Sicherheit

- Die `config.json` ist in `.gitignore` enthalten
- Ihre persönlichen Daten werden nicht versehentlich committet
- Teilen Sie nur die `config.template.json` öffentlich 