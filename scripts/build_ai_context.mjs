// Script to regenerate aiContext.js from the updated markdown docs
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '..', 'src', 'content', 'docs');
const outputFile = join(__dirname, 'aiContext.js');

const docFiles = [
  'whitepaper.md',
  'platform-users-manual.md',
  'faq-retail.md',
  'faq-institutional.md',
];

let combined = '';
for (const file of docFiles) {
  const content = readFileSync(join(docsDir, file), 'utf-8');
  combined += `\n\n=== ${file} ===\n\n${content}`;
}

const output = `export const systemKnowledge = ${JSON.stringify(combined)};\n`;
writeFileSync(outputFile, output, 'utf-8');
console.log(`✅ aiContext.js regenerated (${output.length} bytes) from ${docFiles.length} docs.`);
