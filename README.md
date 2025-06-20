# 📄 md2pdf - Moderner Markdown zu PDF Konverter

Ein flexibler Markdown zu PDF Konvertierer mit professionellem Design, Emoji-Unterstützung und einem speziellen Modus für Angebote.

## ✨ Features

- ✅ **Angebots-Modus**: Erstellt professionelle Angebote mit eigenem Briefkopf (Logo, Firmendaten) und Fußzeile.
- ✅ **Flexible Konfiguration**: Farben, Logo (SVG/PNG/JPG) und Firmendaten werden über eine `config.json` gesteuert.
- ✅ **Professionelle Typografie**: Verwendet Helvetica oder Inter für saubere, moderne Dokumente.
- ✅ **Perfekte Emoji-Darstellung**: Alle Unicode-Emojis funktionieren dank Browser-Rendering.
- ✅ **PDF-Native Header/Footer**: Korrekte Positionierung von Kopf- und Fußzeilen ohne Überlappung.
- ✅ **Wildcard-Unterstützung**: `md2pdf *.md` konvertiert mehrere Dateien auf einmal.

## 🚀 Installation & Konfiguration

### 1. Klonen und Installieren
```bash
# Repository in einen Ordner Ihrer Wahl klonen
git clone https://github.com/KonstiDoll/md2pdf.git md2pdf
cd md2pdf

# Abhängigkeiten installieren
npm install

# Befehl global verfügbar machen
npm link
```
*Falls `npm link` Rechteprobleme verursacht, finden Sie im `INSTALL.md` alternative Methoden.*

### 2. Konfigurieren
Das Tool wird über eine zentrale `config.json`-Datei gesteuert.

```bash
# Vorlage kopieren
cp config.template.json config.json
```

Öffnen Sie nun `config.json` und passen Sie die Werte an Ihre Bedürfnisse an:
- **`company`**: Ihre Firmendaten.
- **`bank`**: Ihre Bankverbindung.
- **`colors`**: Passen Sie `primary` und `text` an Ihr Corporate Design an.
- **`logo`**: Geben Sie den Pfad zu Ihrer Logo-Datei (`.svg`, `.png`, `.jpg`) an und passen Sie die Breite an.

## 📖 Verwendung

### Standard-Konvertierung
Konvertiert eine einfache Markdown-Datei in ein PDF.
```bash
md2pdf meine-datei.md
```

### Angebots-Modus
Aktiviert den Angebots-Modus mit Header und Footer, wie in `config.json` definiert.
```bash
md2pdf --angebot mein-angebot.md
```
Damit der Header korrekt gefüllt wird, muss die Markdown-Datei folgende Felder enthalten:
```markdown
**Auftraggeber:** Max Mustermann GmbH
**Adresse:** Musterstraße 1, 12345 Musterstadt
**Angebotsnummer:** 2024-001
**Datum:** 01. August 2024
**Gültigkeitsdauer:** 30 Tage
```

### Weitere Optionen
| Option | Beschreibung |
|---|---|
| `[output.pdf]` | Optionaler Name für die Ausgabedatei. |
| `--no-open` | Verhindert das automatische Öffnen der PDF. |
| `--save-html` | Speichert die HTML-Datei zur Fehlersuche anstatt ein PDF zu erstellen. |

## 🔧 Technische Details

- **Engine**: Puppeteer (Chromium-basiert) für präzise HTML-zu-PDF-Konvertierung.
- **Markdown-Parser**: `marked.js` für schnelle und GFM-kompatible Verarbeitung.
- **Konfiguration**: Alle Layout-relevanten Daten sind in `config.json` ausgelagert.

## 📝 Lizenz

MIT License

## 🤝 Beitragen

Feedback und Verbesserungen sind willkommen!

### Feature-Wünsche:
- Weitere Font-Optionen
- Theme-Varianten
- Custom CSS-Injection
- Batch-Processing Verbesserungen

### Bekannte Einschränkungen:
- Große Dateien (>50MB) können langsam sein
- Komplexe Tabellen könnten Umbruchprobleme haben
- SVG-Integration ist limitiert

---

**💡 Tipp**: Dieses Tool ist besonders gut für Dokumente mit Emojis geeignet, wo andere PDF-Konvertierer versagen!

**🎯 Use Cases**: 
- Technische Dokumentation
- Präsentationen 
- Reports mit modernem Design
- Social Media Content → PDF
- Jede MD-Datei mit Emojis 