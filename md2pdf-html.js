const puppeteer = require('puppeteer');
const marked = require('marked');
const fs = require('fs');
const path = require('path');

// Markdown-Renderer konfigurieren
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  headerPrefix: 'heading-'
});

// CSS für Helvetica und perfekte Emoji-Darstellung
const helveticaCSS = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Helvetica', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
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
    border-bottom: 3px solid #3498db;
    padding-bottom: 0.5rem;
    font-weight: 700;
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
    margin: 1rem 0;
    font-size: 0.95em;
  }
  
  table th,
  table td {
    border: 1px solid #ddd;
    text-align: left;
    padding: 0.6rem;
  }
  
  table th {
    background-color: #f2f2f2;
    font-weight: 600;
    color: #2c3e50;
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

async function convertMarkdownToPDF(inputPath, outputPath = null, options = {}) {
  let browser;
  
  try {
    console.log(`📄 Konvertiere ${inputPath} zu PDF...`);
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Markdown-Datei nicht gefunden: ${inputPath}`);
    }
    
    const markdownContent = fs.readFileSync(inputPath, 'utf8');
    const htmlContent = marked.parse(markdownContent);
    
    // Titel extrahieren
    const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(inputPath, '.md');
    
    // Vollständiges HTML
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${helveticaCSS}
    </head>
    <body>
        ${htmlContent}
    </body>
    </html>
    `;
    
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
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      displayHeaderFooter: options.showHeader !== false,
      headerTemplate: options.showHeader !== false ? `
        <div style="font-size: 10px; margin: 0 auto; color: #666; font-family: Helvetica;">
          ${title}
        </div>
      ` : '',
      footerTemplate: options.showHeader !== false ? `
        <div style="font-size: 10px; margin: 0 auto; color: #666; font-family: Helvetica;">
          Seite <span class="pageNumber"></span> von <span class="totalPages"></span>
        </div>
      ` : ''
    });
    
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
  
  if (args.length === 0) {
    console.log(`
📄 Markdown zu PDF Konvertierer (mit Emoji-Unterstützung)

Verwendung:
  node md2pdf-html.js <input.md> [output.pdf]
  node md2pdf-html.js *.md
  
Beispiele:
  node md2pdf-html.js README.md
  node md2pdf-html.js README.md output.pdf
    `);
    return;
  }
  
  const inputFile = args[0];
  const outputFile = args[1];
  
  // Wildcard-Unterstützung
  if (inputFile.includes('*')) {
    const glob = require('glob');
    const files = glob.sync(inputFile);
    
    for (const file of files) {
      try {
        await convertMarkdownToPDF(file);
      } catch (error) {
        console.error(`❌ Fehler bei ${file}:`, error.message);
      }
    }
  } else {
    await convertMarkdownToPDF(inputFile, outputFile);
  }
}

module.exports = { convertMarkdownToPDF };

if (require.main === module) {
  main().catch(console.error);
} 