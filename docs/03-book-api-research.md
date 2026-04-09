# Book API Integration Research Brief

## Context
The Canopy "Reading" section (`ResourcesSection`) currently manages books manually with click-to-cycle status (backlog > reading > done). Adding a book lookup API would enable search-as-you-type when adding new books.

## Goodreads API — Deprecated
The Goodreads API was **deprecated and shut down in December 2020**. All developer keys were revoked. There is no official replacement from Goodreads/Amazon. This is not a viable option.

## Recommendation: Open Library API (Primary)

### Overview
- **Provider:** Internet Archive's Open Library project
- **Cost:** Free, no API key required
- **Auth:** None
- **Rate limits:** No published hard limits; recommended to debounce requests (300ms)

### Search Endpoint
```
GET https://openlibrary.org/search.json?q={query}&limit=5
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Book title |
| `author_name` | string[] | Author(s) |
| `first_publish_year` | number | Publication year |
| `cover_i` | number | Cover image ID |
| `isbn` | string[] | ISBN numbers |
| `key` | string | Open Library work ID |
| `number_of_pages_median` | number | Page count |

### Cover Images
```
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg   // Medium (180px)
https://covers.openlibrary.org/b/id/{cover_i}-L.jpg   // Large (600px)
```

### Strengths
- Completely free, no registration
- Good coverage of published books
- Cover images available
- ISBN lookup supported
- No CORS issues (public API)

### Limitations
- Metadata gaps on less popular/newer books
- No user reviews or ratings
- Search can be slow (1-3 seconds for complex queries)
- No genre/category data in search results

## Fallback: Google Books API

### Overview
- **Cost:** Free tier — 1,000 requests/day
- **Auth:** API key required
- **Rate limits:** 1,000/day (free), paid plans available

### Search Endpoint
```
GET https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=5&key={API_KEY}
```

### Response Fields (richer than Open Library)
- `volumeInfo.title`, `volumeInfo.authors[]`
- `volumeInfo.description` — book summary
- `volumeInfo.pageCount`
- `volumeInfo.categories[]` — genres
- `volumeInfo.imageLinks.thumbnail` — cover URL
- `volumeInfo.publishedDate`
- `volumeInfo.industryIdentifiers[]` — ISBNs

### Strengths
- Richer metadata (descriptions, categories, page counts)
- Faster response times
- Better coverage of recent publications

### Limitations
- Requires API key (env variable management)
- 1K/day limit (sufficient for personal use, but worth noting)
- API key should be proxied through Express backend to avoid client exposure

## Implementation Path (Future Phase)

### 1. Create book search utility
**New file:** `apps/ui/lib/bookSearch.ts`

```typescript
export interface BookSearchResult {
  title: string;
  author: string;
  year?: number;
  coverUrl?: string;
  isbn?: string;
  pageCount?: number;
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
  );
  const data = await res.json();
  return (data.docs ?? []).map((doc: Record<string, unknown>) => ({
    title: doc.title as string,
    author: (doc.author_name as string[])?.[0] ?? 'Unknown',
    year: doc.first_publish_year as number | undefined,
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : undefined,
    isbn: (doc.isbn as string[])?.[0],
    pageCount: doc.number_of_pages_median as number | undefined,
  }));
}
```

### 2. Add to Reading section
- In the "Add Book" form in `ResourcesSection`, add a debounced search input
- Display autocomplete dropdown with results from `searchBooks()`
- On selection, pre-fill `createResource()` with: title, author, cover_url, progress_total (page count)

### 3. "Bookshelf" UI Concept
A future "Bookshelf" view could show:
- Grid of book covers (from Open Library cover URLs)
- Filter tabs: Reading / Backlog / Done
- Manual entry + API search combined in one "Add Book" flow
- Rating and review on each book card
- Reading progress bar (pages read / total pages)

## Decision
**Use Open Library API as primary source.** It's free, requires no API key, and provides sufficient metadata for a personal reading tracker. If richer metadata is needed later (descriptions, categories), add Google Books as a supplementary source proxied through the Express backend.
