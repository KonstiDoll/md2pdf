# 📄 md2pdf - Modern Markdown to PDF Converter

Ein moderner Markdown zu PDF Konvertierer mit perfekter **Emoji-Unterstützung** und **Helvetica Font**.

## ✨ Features

- ✅ **Perfekte Emoji-Darstellung** - alle Unicode-Emojis funktionieren (🎯📋💰📢💻🎨🔄📊🛠️)
- ✅ **Helvetica Font** - professionelle Typografie
- ✅ **Modernes CSS-Styling** - sauberes, lesbares Layout
- ✅ **Automatisches Öffnen** - PDF wird nach Erstellung geöffnet
- ✅ **Inhaltsverzeichnis** - automatisch aus Überschriften generiert
- ✅ **Wildcard-Unterstützung** - konvertiere mehrere Dateien auf einmal
- ✅ **Schnell** - HTML→PDF ist schneller als LaTeX

## 🚀 Installation

### **Methode 1: Clone & Install (Empfohlen)**
```bash
# Repository klonen/kopieren
git clone https://github.com/KonstiDoll/md2pdf.git md2pdf
# oder Verzeichnis kopieren nach ~/md2pdf

cd md2pdf

# Dependencies installieren
npm install

# Global verfügbar machen
npm link
# oder bei Rechte-Problemen:
mkdir -p ~/bin
ln -sf "$(pwd)/bin/md2pdf" ~/bin/md2pdf
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### **Methode 2: Manual Setup**
```bash
# Verzeichnis erstellen
mkdir ~/md2pdf
cd ~/md2pdf

# Dependencies installieren
npm init -y
npm install puppeteer marked glob

# Skript-Dateien kopieren (md2pdf-html.js und bin/md2pdf)
# Dann global verfügbar machen wie oben
```

### **Methode 3: Direkte Verwendung**
```bash
# Nur für gelegentliche Nutzung
cd /pfad/zu/md2pdf
node md2pdf-html.js input.md output.pdf
```

## 📖 Verwendung

### Globaler Befehl (nach Installation):
```bash
# Einzelne Datei
md2pdf README.md

# Mit spezifischem Output
md2pdf README.md output.pdf

# Alle MD-Dateien im aktuellen Verzeichnis
md2pdf *.md

# Ohne automatisches Öffnen
md2pdf document.md --no-open

# Hilfe anzeigen
md2pdf --help
```

### Lokale Verwendung (ohne Installation):
```bash
# Im Projektverzeichnis
node /pfad/zu/md2pdf/md2pdf-html.js input.md output.pdf
```

## 🎨 Styling

Das Tool verwendet ein modernes, professionelles Design:

- **Font**: Helvetica (primär), Inter (Fallback)
- **Code**: Monaco, SF Mono, Fira Code
- **Farben**: Professionelle Farbpalette mit blauer Akzentfarbe
- **Layout**: Optimiert für A4-Druck mit 2cm Rändern
- **Typografie**: Saubere Hierarchie mit guter Lesbarkeit

## 🔧 Technische Details

- **Engine**: Puppeteer (Chromium-basiert)
- **Markdown-Parser**: marked.js
- **Output**: PDF mit eingebetteten Fonts
- **Emoji-Support**: Native Browser-Unterstützung
- **Dependencies**: puppeteer, marked, glob

## 📋 Systemvoraussetzungen

- **Node.js** ≥ 16.0.0
- **Betriebssystem**: macOS, Linux, Windows
- **Internet**: Für initiale Chromium-Installation (Puppeteer)
- **Speicher**: ~200MB für Chromium + Dependencies

## 🆚 Vergleich zu anderen Tools

| Feature | md2pdf | pandoc + LaTeX | andere Tools |
|---------|--------|----------------|--------------|
| Emoji-Support | ✅ Perfekt | ❌ Problematisch | ⚠️ Begrenzt |
| Font-Control | ✅ Helvetica | ⚠️ Kompliziert | ⚠️ Begrenzt |
| Setup | ✅ Einfach | ❌ Komplex | ⚠️ Variiert |
| Geschwindigkeit | ✅ Schnell | ⚠️ Langsam | ⚠️ Variiert |
| Styling | ✅ Modern | ⚠️ LaTeX-typisch | ⚠️ Begrenzt |

## 🛠️ Entwicklung

```bash
# Dependencies installieren
npm install

# Testen
npm test

# Einzelne Datei konvertieren
npm start input.md
```

## 🚨 Troubleshooting

### Installation schlägt fehl:
```bash
# Bei npm link Problemen (Rechte):
mkdir -p ~/bin
ln -sf "$(pwd)/bin/md2pdf" ~/bin/md2pdf

# PATH prüfen:
echo $PATH | grep $HOME/bin

# Falls nicht im PATH:
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Puppeteer Probleme:
```bash
# Chromium manuell installieren:
npx puppeteer browsers install chrome

# Bei Linux zusätzliche Dependencies:
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Emojis werden nicht angezeigt:
- Das Tool nutzt Browser-Engine → Emojis sollten immer funktionieren
- Falls nicht: Font-Fallbacks sind konfiguriert
- Prüfen Sie die PDF in verschiedenen Viewern

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