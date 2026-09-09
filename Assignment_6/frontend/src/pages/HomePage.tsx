import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import BookCover from '../components/BookCover';
import Reveal from '../components/Reveal';

const FEATURED = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    blurb: 'Timeless advice on writing readable, maintainable software.',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Fiction',
    blurb: 'An epic saga of politics and giant sandworms on Arrakis.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Help',
    blurb: 'Tiny changes, remarkable results — master your habits.',
  },
];

const MARQUEE_ITEMS = [
  'Fiction',
  'Programming',
  'Database',
  'Web Development',
  'Computer Science',
  'Business',
  'Self Help',
  'Science',
];

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Secure by design',
    text: 'BCrypt password hashing and JWT authentication protect every account.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: 'Curated catalogue',
    text: 'Hand-picked titles across eight categories, searchable in seconds.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    title: 'Reads anywhere',
    text: 'A fully responsive experience — from a phone to a wide desktop.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-dots" aria-hidden="true" />
        <div className="orb orb-amber" aria-hidden="true" />
        <div className="orb orb-teal" aria-hidden="true" />
        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5 py-lg-4">
            <div className="col-12 col-lg-7">
              <span className="section-eyebrow on-dark anim-fade-up">Your online book store</span>
              <h1 className="display-hero anim-fade-up" style={{ '--d': '90ms' } as CSSProperties}>
                Discover Your Next <span className="text-shine">Great Read</span>
              </h1>
              <p className="hero-sub mt-3 anim-fade-up" style={{ '--d': '180ms' } as CSSProperties}>
                Explore books across technology, fiction, business, science and more —
                all in one cosy, searchable catalogue.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4 anim-fade-up" style={{ '--d': '270ms' } as CSSProperties}>
                <Link to="/catalogue" className="btn btn-glow">
                  Browse Catalogue →
                </Link>
                <Link to="/register" className="btn btn-ghost">
                  Create account
                </Link>
              </div>
              <div className="hero-stats anim-fade-up" style={{ '--d': '360ms' } as CSSProperties}>
                <div>
                  <div className="stat-num">12+</div>
                  <div className="stat-label">Curated titles</div>
                </div>
                <div>
                  <div className="stat-num">8</div>
                  <div className="stat-label">Categories</div>
                </div>
                <div>
                  <div className="stat-num">100%</div>
                  <div className="stat-label">Secure auth</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-5 anim-fade-in" style={{ '--d': '300ms' } as CSSProperties}>
              <div className="hero-shelf" aria-hidden="true">
                <div className="hero-book hero-book-1">
                  <div className="hb-letter">D</div>
                  <div className="hb-title">Dune · Frank Herbert</div>
                </div>
                <div className="hero-book hero-book-2">
                  <div className="hb-letter">C</div>
                  <div className="hb-title">Clean Code · Robert C. Martin</div>
                </div>
                <div className="hero-book hero-book-3">
                  <div className="hb-letter">A</div>
                  <div className="hb-title">Atomic Habits · James Clear</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i}>✦ {item}</span>
          ))}
        </div>
      </div>

      {/* Featured books */}
      <section className="container py-5">
        <Reveal>
          <span className="section-eyebrow">Staff picks</span>
          <h2 className="section-title">Featured Books</h2>
          <p className="lead-soft">A taste of the shelves — log in to explore the full collection.</p>
        </Reveal>
        <div className="row g-4 mt-1">
          {FEATURED.map((book, i) => (
            <div className="col-12 col-md-4" key={book.title}>
              <Reveal delay={i * 120} className="h-100">
                <div className="card book-card h-100">
                  <BookCover title={book.title} category={book.category} />
                  <div className="card-body">
                    <span className="badge-cat mb-2">{book.category}</span>
                    <h5 className="book-title mt-1">{book.title}</h5>
                    <p className="text-muted small mb-2">by {book.author}</p>
                    <p className="card-text small text-muted mb-0">{book.blurb}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal className="text-center mt-4">
          <Link to="/catalogue" className="btn btn-outline-nest">
            View Full Catalogue
          </Link>
        </Reveal>
      </section>

      {/* Why BookNest */}
      <section style={{ background: 'var(--nest-cream)' }}>
        <div className="container py-5">
          <Reveal className="text-center">
            <span className="section-eyebrow">Why BookNest</span>
            <h2 className="section-title">Built for readers, engineered with care</h2>
          </Reveal>
          <div className="row g-4 mt-2">
            {FEATURES.map((feature, i) => (
              <div className="col-12 col-md-4" key={feature.title}>
                <Reveal delay={i * 120} className="h-100">
                  <div className="card feature-card h-100">
                    <div className="card-body p-4">
                      <span className="feature-icon mb-3">{feature.icon}</span>
                      <h5 className="font-display fw-semibold">{feature.title}</h5>
                      <p className="text-muted small mb-0">{feature.text}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-5">
        <Reveal>
          <div className="cta-banner p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-8">
                <h2 className="font-display fw-semibold mb-2">Your next favourite book is one login away.</h2>
                <p className="mb-0" style={{ color: 'rgba(253,249,240,.75)' }}>
                  Create a free account to unlock search, filtering, and the full catalogue.
                </p>
              </div>
              <div className="col-12 col-lg-4 text-lg-end">
                <Link to="/register" className="btn btn-glow">
                  Get started →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
