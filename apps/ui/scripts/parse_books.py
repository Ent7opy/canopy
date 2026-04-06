#!/usr/bin/env python3
import re
import json

with open('../reading-list.md', 'r') as f:
    content = f.read()

# Split by sections with headers like "## 🌍 Foundations & Big Picture"
sections = re.split(r'^##\s+(.*)$', content, flags=re.MULTILINE)
books = []
current_category = None

for i in range(1, len(sections), 2):
    category = sections[i].strip()
    # Remove emoji and extra spaces
    category = re.sub(r'^[^a-zA-Z]+', '', category).strip()
    table_text = sections[i + 1]
    
    # Find markdown tables
    table_match = re.search(r'\|.*\|\n\|[-:| ]+\|\n((?:\|.*\|\n)+)', table_text)
    if not table_match:
        continue
    
    rows = table_match.group(1).strip().split('\n')
    for row in rows:
        cells = [c.strip() for c in row.split('|') if c.strip()]
        if len(cells) < 4:
            continue
        # cells: Book, Author, Year, Why Read?
        title = re.sub(r'\*\*(.*?)\*\*', r'\1', cells[0]).strip()
        author = cells[1]
        year = cells[2] if cells[2] != '–' else ''
        description = cells[3] if len(cells) > 3 else ''
        
        books.append({
            'id': f"{author.lower().replace(' ', '-')}-{title.lower().replace(' ', '-')[:20]}",
            'title': title,
            'author': author,
            'year': year,
            'category': category,
            'description': description,
            'read': False,
            'url': ''
        })

# Output as TypeScript
ts = f"export type Book = {{\n"
ts += "  id: string;\n"
ts += "  title: string;\n"
ts += "  author: string;\n"
ts += "  year: string;\n"
ts += "  category: string;\n"
ts += "  description: string;\n"
ts += "  read: boolean;\n"
ts += "  url: string;\n"
ts += "};\n\n"
ts += f"export const books: Book[] = {json.dumps(books, indent=2)};\n"

with open('../data/books.ts', 'w') as f:
    f.write(ts)

print(f"Parsed {len(books)} books")