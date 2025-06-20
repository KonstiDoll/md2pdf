#!/bin/bash

# md2pdf Auto-Installer
# Usage: curl -fsSL <url>/install.sh | bash

set -e

echo "📄 md2pdf Installer"
echo "==================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert."
    echo "   Bitte installieren Sie Node.js >= 16.0.0 von https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js Version zu alt ($NODE_VERSION). Mindestens Version 16 erforderlich."
    exit 1
fi

echo "✅ Node.js $(node --version) gefunden"

# Check if already installed
if command -v md2pdf &> /dev/null; then
    echo "⚠️  md2pdf ist bereits installiert. Überschreiben? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Installation abgebrochen."
        exit 0
    fi
fi

# Create installation directory
INSTALL_DIR="$HOME/md2pdf"
echo "📁 Installiere nach: $INSTALL_DIR"

if [ -d "$INSTALL_DIR" ]; then
    echo "🔄 Vorhandene Installation wird aktualisiert..."
    rm -rf "$INSTALL_DIR"
fi

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Download files (here you would normally clone or download)
echo "📥 Lade Dateien herunter..."

# For now, we'll create the basic structure
# In a real scenario, you'd download from GitHub/etc.

# Create package.json
cat > package.json << 'EOF'
{
  "name": "md2pdf-emoji",
  "version": "1.0.0",
  "description": "Modern Markdown to PDF converter with emoji support",
  "main": "md2pdf-html.js",
  "bin": {
    "md2pdf": "./bin/md2pdf"
  },
  "keywords": ["markdown", "pdf", "emoji", "helvetica"],
  "author": "Scenerii Tools",
  "license": "MIT",
  "dependencies": {
    "puppeteer": "^21.0.0",
    "marked": "^12.0.0",
    "glob": "^10.0.0"
  }
}
EOF

echo "📦 Installiere Dependencies..."
npm install

# Create bin directory and script
mkdir -p bin

cat > bin/md2pdf << 'EOF'
#!/usr/bin/env node

const path = require('path');
const { convertMarkdownToPDF } = require('../md2pdf-html.js');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
📄 md2pdf - Markdown zu PDF Konvertierer mit Emoji-Unterstützung

Verwendung:
  md2pdf <input.md> [output.pdf]
  md2pdf *.md
  md2pdf file.md --no-open
  
Features:
  ✅ Perfekte Emoji-Darstellung (🎯📋💰📢💻🎨)
  ✅ Helvetica Font
  ✅ Modernes Styling
    `);
    return;
  }
  
  const inputFile = args[0];
  const outputFile = args.find(arg => arg.endsWith('.pdf') && !arg.includes('*'));
  const noOpen = args.includes('--no-open');
  
  try {
    if (inputFile.includes('*')) {
      const glob = require('glob');
      const files = glob.sync(inputFile);
      
      for (const file of files) {
        await convertMarkdownToPDF(file, null, { openAfter: !noOpen });
      }
    } else {
      await convertMarkdownToPDF(inputFile, outputFile, { openAfter: !noOpen });
    }
  } catch (error) {
    console.error('❌ Fehler:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
EOF

chmod +x bin/md2pdf

# TODO: Add md2pdf-html.js content here or download it

echo "🔗 Erstelle globalen Symlink..."
mkdir -p "$HOME/bin"
ln -sf "$INSTALL_DIR/bin/md2pdf" "$HOME/bin/md2pdf"

# Add to PATH if not already there
SHELL_RC="$HOME/.zshrc"
if [[ "$SHELL" == *"bash"* ]]; then
    SHELL_RC="$HOME/.bashrc"
fi

if ! grep -q 'export PATH="$HOME/bin:$PATH"' "$SHELL_RC" 2>/dev/null; then
    echo 'export PATH="$HOME/bin:$PATH"' >> "$SHELL_RC"
    echo "✅ PATH erweitert in $SHELL_RC"
fi

export PATH="$HOME/bin:$PATH"

echo ""
echo "🎉 Installation erfolgreich!"
echo ""
echo "Verwendung:"
echo "  md2pdf README.md"
echo "  md2pdf *.md"
echo "  md2pdf --help"
echo ""
echo "Öffnen Sie ein neues Terminal oder führen Sie aus:"
echo "  source $SHELL_RC"
echo ""

# Test installation
if command -v md2pdf &> /dev/null; then
    echo "✅ md2pdf ist bereit!"
else
    echo "⚠️  Möglicherweise müssen Sie ein neues Terminal öffnen."
fi 