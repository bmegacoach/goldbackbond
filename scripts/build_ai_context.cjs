const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../src/content/docs');
const files = ['whitepaper.md', 'platform-users-manual.md', 'faq-retail.md', 'faq-institutional.md'];
let combinedText = '';

for (const file of files) {
  const filePath = path.join(docsDir, file);
  if (fs.existsSync(filePath)) {
    combinedText += `\n\n=== ${file} ===\n\n`;
    combinedText += fs.readFileSync(filePath, 'utf8');
  } else {
    console.warn(`File not found: ${filePath}`);
  }
}

const outPath = path.join(__dirname, '../src/lib/aiContext.ts');
fs.writeFileSync(outPath, `export const systemKnowledge = ${JSON.stringify(combinedText)};\n`);
console.log('AI context successfully built out of the Data Center markdowns.');
