# 🚀 Quick Install Guide

## One-Line Installation (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/KonstiDoll/md2pdf/main/install.sh | bash
```

## Manual Installation (5 Minuten)

### 1. Dependencies
```bash
# Node.js muss installiert sein
node --version  # sollte >= 16.0.0 sein
```

### 2. Download & Setup
```bash
# Tool herunterladen
git clone https://github.com/KonstiDoll/md2pdf.git ~/md2pdf
# oder ZIP herunterladen und entpacken nach ~/md2pdf

cd ~/md2pdf
npm install
```

### 3. Global verfügbar machen
```bash
# Symlink erstellen
mkdir -p ~/bin
ln -sf "$(pwd)/bin/md2pdf" ~/bin/md2pdf

# PATH erweitern (nur einmal nötig)
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 4. Test
```bash
md2pdf --help
```

## Fertig! 🎉

Jetzt können Sie von überall aus verwenden:
```bash
md2pdf mein-dokument.md
```

---

**Probleme?** Siehe [README.md](README.md#troubleshooting) für Troubleshooting. 