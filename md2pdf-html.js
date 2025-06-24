const puppeteer = require('puppeteer');
const marked = require('marked');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Robuste Funktion zum Laden von Bild-Dateien als Base64
function loadLogoAsBase64(logoConfig, configPath) {
  if (!logoConfig || !logoConfig.file) {
    console.warn('⚠️  Keine Logo-Datei in der Konfiguration angegeben.');
    return null;
  }
  
  // Pfad zum Logo relativ zur config.json auflösen
  const logoPath = path.resolve(path.dirname(configPath), logoConfig.file);
  
  if (fs.existsSync(logoPath)) {
    try {
      const fileContent = fs.readFileSync(logoPath);
      const mimeType = mime.lookup(logoPath);
      
      if (!mimeType || !mimeType.startsWith('image')) {
        console.warn(`⚠️  Ungültiger oder nicht unterstützter Bild-MIME-Type für ${logoConfig.file}: ${mimeType}`);
        return null;
      }
      
      return `data:${mimeType};base64,${fileContent.toString('base64')}`;
    } catch (error) {
      console.warn(`⚠️  Fehler beim Laden der Logo-Datei ${logoConfig.file}:`, error.message);
      return null;
    }
  } else {
    console.warn(`⚠️  Logo-Datei nicht gefunden unter: ${logoPath}`);
    return null;
  }
}

// Konfiguration laden
function loadConfig() {
  const configPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { config, configPath };
    } catch (error) {
      console.warn('⚠️  Fehler beim Laden der config.json, verwende Standard-Konfiguration');
    }
  }
  
  // Fallback Standard-Konfiguration
  const defaultConfig = {
    company: {
      name: "Ihr Firmenname",
      address: "Ihre Adresse",
      city: "Ihre Stadt",
      ustId: "Ihre USt-ID",
      email: "ihre@email.de",
      phone: "+49 xxx xxxxxxx",
      website: "ihre-website.de"
    },
    bank: {
      name: "Ihre Bank",
      iban: "Ihre IBAN",
      bic: "Ihr BIC/SWIFT"
    },
    colors: {
      primary: "#3498db",
      text: "#2c3e50"
    },
    logo: {
      file: "logo.svg",
      width: "80px"
    }
  };
  return { config: defaultConfig, configPath };
}

// Markdown-Renderer konfigurieren
marked.use({
  breaks: true,
  gfm: true,
  headerIds: true,
  headerPrefix: 'heading-'
});

// Angebots-Header Template generieren
function generateAngebotHeaderCSS(config) {
  return `
<style>
  /* Dieses CSS wird jetzt innerhalb der PDF-Header/Footer-Templates verwendet */
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica', sans-serif;
    font-size: 8pt;
  }
  .angebot-header, .angebot-footer {
    box-sizing: border-box;
    width: 100%;
    padding: 0 40px;
    color: ${config.colors.text};
  }
  .angebot-header {
    height: 150px;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
  }
  .angebot-footer {
    height: 80px;
    border-top: 2px solid #e0e0e0;
  }
  .header-row, .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .header-row {
    align-items: baseline;
  }
  .header-left, .footer-left { flex: 1; }
  .footer-center { flex: 1; text-align: left; }
  .header-right, .footer-right { flex: 1; text-align: right; }
  
  .company-info { font-size: 9pt; line-height: 1.4; margin-top: 0px; }
  .angebot-title { font-size: 14pt; color: ${config.colors.primary}; font-weight: bold; margin-bottom: 5px; -webkit-print-color-adjust: exact; }
  .angebot-dates { 
    font-size: 9pt;
    color: ${config.colors.text};
    font-weight: normal;
  }
  .auftraggeber-info {
    font-size: 11pt;
    color: ${config.colors.text};
    line-height: 1.4;
    border: 1px solid #e0e0e0;
    padding: 8px;
    background-color: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 2rem;
  }
</style>
`;
}

// CSS für den Hauptinhalt, jetzt als Funktion für dynamische Farben
function generateMainCSS(config) {
  return `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Helvetica', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 4rem;
    font-size: 12pt;
    color: #333;
    background: white;
  }
  
  /* Helvetica-ähnliche Typografie */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Helvetica', 'Inter', sans-serif;
    color: #2c3e50;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  
  h1 { 
    font-size: 2.2rem; 
    border-bottom: 3px solid ${config.colors.primary};
    padding-bottom: 0.5rem;
    font-weight: 700;
    -webkit-print-color-adjust: exact;
  }
  
  h2 { 
    font-size: 1.6rem; 
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.3rem;
  }
  
  h3 { 
    font-size: 1.3rem; 
    color: #34495e;
  }
  
  hr {
    border: none;
    border-top: 2px solid #ecf0f1;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  
  /* Emoji-Unterstützung */
  .emoji {
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', emoji;
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    line-height: 1;
  }
  
  /* Code-Styling */
  code {
    font-family: 'Monaco', 'SF Mono', 'Fira Code', 'Consolas', monospace;
    background-color: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
    color: #e91e63;
  }
  
  pre {
    font-family: 'Monaco', 'SF Mono', 'Fira Code', 'Consolas', monospace;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    border-left: 4px solid #3498db;
    margin: 1rem 0;
  }
  
  pre code {
    background: none;
    padding: 0;
    color: #333;
  }
  
  /* Listen */
  ul, ol {
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.4rem 0;
  }
  
  /* Links */
  a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  a:hover {
    color: #2980b9;
    text-decoration: underline;
  }
  
  /* Tabellen */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5rem 0;
    font-size: 0.95em;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  
  table th,
  table td {
    border: 1px solid #e0e0e0;
    text-align: left;
    padding: 0.8rem 1rem;
  }
  
  table th {
    background-color: #f7f7f7;
    font-weight: 600;
    color: #2c3e50;
    -webkit-print-color-adjust: exact;
  }

  table tr:nth-child(even) {
    background-color: #fdfdfd;
    -webkit-print-color-adjust: exact;
  }
  
  /* Blockquotes */
  blockquote {
    border-left: 4px solid #3498db;
    margin: 0;
    padding-left: 1rem;
    color: #7f8c8d;
    font-style: italic;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 0 4px 4px 0;
  }
  
  /* Print-optimiert */
  @media print {
    body {
      font-size: 11pt;
      padding: 1rem;
    }
    
    h1, h2, h3 {
      page-break-after: avoid;
    }
    
    pre, blockquote, table {
      page-break-inside: avoid;
    }
    
    a {
      color: #333;
      text-decoration: none;
    }
    
    a[href]:after {
      content: " (" attr(href) ")";
      font-size: 0.8em;
      color: #666;
    }
  }
</style>
`;
}

async function convertMarkdownToPDF(inputPath, outputPath = null, options = {}) {
  let browser;
  
  try {
    console.log(`📄 Konvertiere ${inputPath} zu PDF...`);
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Markdown-Datei nicht gefunden: ${inputPath}`);
    }
    
    const markdownContent = fs.readFileSync(inputPath, 'utf8');
    
    // Angebotsdaten extrahieren
    const angebotData = {};
    const fieldPatterns = {
      auftraggeber: /^\*\*Auftraggeber:\*\*\s*(.+)$/m,
      adresse: /^\*\*Adresse:\*\*\s*(.+)$/m,
      angebotssteller: /^\*\*Angebotssteller:\*\*\s*(.+)$/m,
      datum: /^\*\*Datum:\*\*\s*(.+)$/m,
      gueltigkeitsdauer: /^\*\*Gültigkeitsdauer:\*\*\s*(.+)$/m,
      angebotsnummer: /^\*\*Angebotsnummer:\*\*\s*(.+)$/m
    };
    
    // Alle Felder extrahieren
    for (const [key, pattern] of Object.entries(fieldPatterns)) {
      const match = markdownContent.match(pattern);
      angebotData[key] = match ? match[1].trim() : '';
    }
    
    // Angebotsdaten-Zeilen aus Markdown entfernen für die PDF-Generierung
    let cleanedMarkdownContent = markdownContent;
    for (const pattern of Object.values(fieldPatterns)) {
      cleanedMarkdownContent = cleanedMarkdownContent.replace(pattern, '');
    }
    cleanedMarkdownContent = cleanedMarkdownContent.trim();
    
    const htmlContent = marked.parse(cleanedMarkdownContent);
    
    // Titel extrahieren
    const titleMatch = cleanedMarkdownContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(inputPath, '.md');
    
    // Konfiguration laden
    const { config, configPath } = loadConfig();
    
    // Auftraggeber-Block für die erste Seite generieren
    let auftraggeberSectionHTML = '';
    if (options.angebotMode && (angebotData.auftraggeber || angebotData.adresse)) {
      auftraggeberSectionHTML = `<div class="auftraggeber-info">
        ${angebotData.auftraggeber ? `<strong>Auftraggeber:</strong> ${angebotData.auftraggeber}<br>` : ''}
        ${angebotData.adresse ? `<strong>Adresse:</strong> ${angebotData.adresse}` : ''}
      </div>`;
    }

    // Angebots-Header und Footer generieren
    function generateAngebotHeader(config, angebotData, configPath) {
      const angebotsnummer = angebotData.angebotsnummer || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
      const datum = angebotData.datum || new Date().toLocaleDateString('de-DE');
      const gueltigkeitsdauer = angebotData.gueltigkeitsdauer || '30 Tage';
      
      // Logo laden und als Base64 einbetten
      let logoHTML = '';
      const logoDataURL = loadLogoAsBase64(config.logo, configPath);
      
      if (logoDataURL) {
        logoHTML = `<img src="${logoDataURL}" style="display: block; width: ${config.logo.width}; height: auto; max-height: 80px; object-fit: contain;" alt="Logo" />`;
      }
      
      return `
        <div class="angebot-header">
          <div class="header-row">
            <div class="header-left">
              ${logoHTML}
              <div class="company-info">
                <strong>${config.company.name}</strong> • ${config.company.address} • ${config.company.city}
              </div>
            </div>
            <div class="header-right">
              <div class="angebot-title">Angebot Nr. ${angebotsnummer}</div>
              <div class="angebot-dates">
                Datum: ${datum}<br>
                Gültigkeitsdauer: ${gueltigkeitsdauer}
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    const angebotHeader = generateAngebotHeader(config, angebotData, configPath);
    
    function generateAngebotFooter(config) {
      return `
        <div class="angebot-footer">
          <div class="footer-row">
            <div class="footer-left">
              <strong>${config.company.name}</strong><br>
              ${config.company.address}<br>
              ${config.company.city}<br>
              USt-ID: ${config.company.ustId}
            </div>
            <div class="footer-center">
              <strong>${config.bank.name}</strong><br>
              IBAN: ${config.bank.iban}<br>
              BIC/SWIFT: ${config.bank.bic}
            </div>
            <div class="footer-right">
              <strong>${config.company.website}</strong><br>
              ${config.company.email}<br>
              ${config.company.phone}
            </div>
          </div>
        </div>
      `;
    }
    
    const angebotFooter = generateAngebotFooter(config);
    
    // Vollständiges HTML für den *Hauptinhalt* (Header nur hier, für Seite 1)
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${generateMainCSS(config)}
        ${options.angebotMode ? generateAngebotHeaderCSS(config) : ''}
    </head>
    <body>
        ${options.angebotMode ? angebotHeader : ''}
        ${auftraggeberSectionHTML}
        ${htmlContent}
    </body>
    </html>
    `;
    
    // Wenn --save-html gesetzt ist, hier abbrechen und die HTML-Datei speichern
    if (options.saveHtml) {
      const debugPath = path.join(__dirname, 'debug.html');
      fs.writeFileSync(debugPath, fullHtml);
      console.log(`✅ HTML-Datei zur Fehlersuche gespeichert: ${debugPath}`);
      return; // PDF-Generierung überspringen
    }
    
    if (!outputPath) {
      outputPath = inputPath.replace(/\.md$/, '.pdf');
    }
    
    // Puppeteer starten
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0'
    });
    
    // PDF generieren
    const pdfOptions = {
      path: outputPath,
      format: 'A4',
      printBackground: true,
    };
    
    if (options.angebotMode) {
      // Nur der Footer wird auf jeder Seite wiederholt
      pdfOptions.displayHeaderFooter = true;
      pdfOptions.headerTemplate = `<span></span>`; // Leerer Header
      pdfOptions.footerTemplate = `
        ${generateAngebotHeaderCSS(config)}
        ${angebotFooter}
      `;
      pdfOptions.margin = {
        top: '2cm',      // Standard-Seitenrand oben
        bottom: '100px', // Platz für den Footer
        left: '2cm',
        right: '2cm'
      };
    } else {
      // Normaler Modus
      pdfOptions.displayHeaderFooter = options.showHeader !== false;
      pdfOptions.margin = {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      };
      pdfOptions.headerTemplate = options.showHeader !== false ? `
        <div style="font-size: 10px; width: 100%; text-align: center; padding-top: 1cm; color: #666; font-family: Helvetica;">
          ${title}
        </div>
      ` : '';
      pdfOptions.footerTemplate = options.showHeader !== false ? `
        <div style="font-size: 10px; width: 100%; text-align: center; padding-bottom: 1cm; color: #666; font-family: Helvetica;">
          Seite <span class="pageNumber"></span> von <span class="totalPages"></span>
        </div>
      ` : '';
    }
    
    await page.pdf(pdfOptions);
    
    console.log(`✅ PDF erfolgreich erstellt: ${outputPath}`);
    
    // Automatisch öffnen
    if (options.openAfter !== false) {
      const { exec } = require('child_process');
      exec(`open "${outputPath}"`);
      console.log(`🔍 PDF geöffnet`);
    }
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ Fehler bei PDF-Konvertierung:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const options = {
    openAfter: !args.includes('--no-open'),
    angebotMode: args.includes('--angebot'),
    saveHtml: args.includes('--save-html')
  };

  // Filtere Flags heraus, um die reinen Dateinamen zu erhalten
  const fileArgs = args.filter(arg => !arg.startsWith('--'));

  // Zeige Hilfe, wenn keine Eingabedatei angegeben ist
  if (fileArgs.length === 0) {
    console.log(`
📄 Markdown zu PDF Konvertierer (mit Angebotsmodus)

Verwendung:
  md2pdf [optionen] <input.md>
  md2pdf [optionen] <datei1.md> <datei2.md> ...
  md2pdf [optionen] *.md

Optionen:
  --angebot      Aktiviert den Angebotsmodus mit Header und Footer.
  --no-open      Verhindert das automatische Öffnen der PDF nach der Erstellung.
  --save-html    Speichert das generierte HTML als debug.html anstatt PDF zu erstellen.
  
Beispiele:
  md2pdf --angebot mein-angebot.md
  md2pdf README.md
  md2pdf *.md
    `);
    return;
  }
  
  // Verarbeite jede übergebene Datei
  for (const file of fileArgs) {
    try {
      // Wildcard-Unterstützung innerhalb von Anführungszeichen (z.B. "projekte/*.md")
      if (file.includes('*')) {
        const glob = require('glob');
        const expandedFiles = glob.sync(file);
        if (expandedFiles.length === 0) {
          console.warn(`⚠️  Keine Dateien für das Muster gefunden: ${file}`);
        }
        for (const expandedFile of expandedFiles) {
          await convertMarkdownToPDF(expandedFile, null, options);
        }
      } else {
        await convertMarkdownToPDF(file, null, options);
      }
    } catch (error) {
      console.error(`❌ Fehler bei der Verarbeitung von ${file}:`, error.message);
    }
  }
}

module.exports = { convertMarkdownToPDF };

if (require.main === module) {
  main().catch(console.error);
} 