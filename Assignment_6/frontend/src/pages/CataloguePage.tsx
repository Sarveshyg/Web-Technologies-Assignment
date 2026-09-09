import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { fetchBooks } from '../services/bookService';
import BookCover from '../components/BookCover';
import type { Book } from '../types';

const CATEGORIES = [
  'All',
  'Fiction',
  'Programming',
  'Database',
  'Web Development',
  'Computer Science',
  'Business',
  'Self Help',
  'Science',
];

function SkeletonGrid() {
  return (
    <div className="row g-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={i}>
          <div className="card skeleton-card">
            <div className="shimmer" style={{ height: '168px' }} />
            <div className="card-body">
              <div className="shimmer rounded-pill mb-2" style={{ height: '1.2rem', width: '40%' }} />
              <div className="shimmer rounded mb-2" style={{ height: '1.1rem', width: '85%' }} />
              <div className="shimmer rounded" style={{ height: '0.9rem', width: '60%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CataloguePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load books.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesSearch =
        q === '' ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || book.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
  };

  return (
    <div className="container py-5">
      <div className="anim-fade-up">
        <span className="section-eyebrow">The shelves</span>
        <h2 className="section-title">Book Catalogue</h2>
        <p className="lead-soft">Search, filter, and find your next great read.</p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar p-3 p-md-4 mt-4 mb-2 anim-fade-up" style={{ '--d': '120ms' } as CSSProperties}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                className="form-control"
                placeholder="Search by title or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search by title or author"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 text-md-end">
            <span className="result-count">
              {loading ? 'Loading…' : `${filtered.length} of ${books.length} books`}
            </span>
          </div>
        </div>
        <div className="pill-row mt-3" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`pill${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="alert alert-warning alert-anim">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="big-emoji">🔍</span>
            <h4 className="font-display mt-3">No books match your search</h4>
            <p className="text-muted">Try a different title, author, or category.</p>
            <button className="btn btn-outline-nest mt-2" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="row g-4" key={`${category}-${search}`}>
            {filtered.map((book, i) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={book.id}>
                <div
                  className="card book-card h-100 anim-fade-up"
                  style={{ '--d': `${Math.min(i, 11) * 55}ms` } as CSSProperties}
                >
                  <BookCover title={book.title} category={book.category} />
                  <div className="card-body d-flex flex-column">
                    <span className="badge-cat mb-2 align-self-start">{book.category}</span>
                    <h5 className="book-title">{book.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted small">by {book.author}</h6>
                    <p className="card-text small text-muted flex-grow-1">{book.description}</p>
                    <p className="price-tag mb-0">₹{book.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
