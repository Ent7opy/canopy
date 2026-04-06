const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', '..', 'reading-list.md'), 'utf8');

const sections = content.split(/^##\s+/m);
const books = [];
let currentCategory = '';

for (const section of sections) {
  const lines = section.split('\n');
  const header = lines[0];
  if (!header || !header.includes('&') && !header.includes('Foundations') && !header.includes('Energy') && !header.includes('Ecology') && !header.includes('Solutions') && !header.includes('Data') && !header.includes('Audiobooks')) {
    continue;
  }
  // Clean category name
  let category = header.replace(/^[^a-zA-Z]+/, '').trim();
  const tableStart = lines.findIndex(l => l.includes('| Book |'));
  if (tableStart === -1) continue;
  const tableLines = lines.slice(tableStart);
  const separatorIndex = tableLines.findIndex(l => l.match(/^\|[-:| ]+\|$/));
  if (separatorIndex === -1) continue;
  const dataLines = tableLines.slice(separatorIndex + 1);
  for (const line of dataLines) {
    if (!line.includes('|') || line.startsWith('| **')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length < 4) continue;
    const title = cells[0].replace(/\*\*/g, '');
    const author = cells[1];
    const year = cells[2];
    const description = cells[3];
    books.push({
      id: `${author.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`.replace(/[^a-z0-9-]/g, ''),
      title,
      author,
      year: year === '–' ? '' : year,
      category,
      description,
      read: false,
      url: ''
    });
  }
}

const ts = `export type Book = {
  id: string;
  title: string;
  author: string;
  year: string;
  category: string;
  description: string;
  read: boolean;
  url: string;
};

export const books: Book[] = ${JSON.stringify(books, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'data', 'books.ts'), ts);
console.log(`Parsed ${books.length} books`);