const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Troy\\Downloads\\GBB Sales Rep training and IC';
const destDir = path.join(__dirname, '../src/content/docs');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function extractMarkdown(filePath, destPath, index = 0) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const blocks = content.split('```md');
    if (blocks.length > index + 1) {
      const text = blocks[index + 1].split('```')[0].trim();
      fs.writeFileSync(destPath, text);
      console.log(`Wrote ${destPath}`);
    } else {
      console.log(`Could not find markdown block at index ${index} in ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

// Write whitepaper
extractMarkdown(
  path.join(srcDir, 'Goldbackbond Whitepaper V1.md'),
  path.join(destDir, 'whitepaper.md')
);

// Write users manual
extractMarkdown(
  path.join(srcDir, 'Goldbackbond Platform users.md'),
  path.join(destDir, 'platform-users-manual.md')
);

// Write FAQs
const faqPath = path.join(srcDir, 'Goldbacbond Retail and institutional FAQ.md');
if (fs.existsSync(faqPath)) {
  const faqContent = fs.readFileSync(faqPath, 'utf-8');
  const faqBlocks = faqContent.split('```md');
  if (faqBlocks.length > 2) {
    const retailText = faqBlocks[1].split('```')[0].trim();
    fs.writeFileSync(path.join(destDir, 'faq-retail.md'), retailText);
    console.log('Wrote faq-retail.md');
    
    const instText = faqBlocks[2].split('```')[0].trim();
    fs.writeFileSync(path.join(destDir, 'faq-institutional.md'), instText);
    console.log('Wrote faq-institutional.md');
  } else {
    console.log('Could not find enough blocks in FAQ file.');
  }
} else {
  console.log(`FAQ file not found at ${faqPath}`);
}
