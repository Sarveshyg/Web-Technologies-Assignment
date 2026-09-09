/** Maps a book category to a cover gradient class (see index.css). */
export function coverClassFor(category: string): string {
  const key = category.trim().toLowerCase().replace(/\s+/g, '-');
  const known = new Set([
    'fiction',
    'programming',
    'database',
    'web-development',
    'computer-science',
    'business',
    'self-help',
    'science',
  ]);
  return known.has(key) ? `cover-${key}` : 'cover-default';
}

interface BookCoverProps {
  title: string;
  category: string;
}

/** CSS-only book cover: gradient by category + serif initial + hover sheen. */
export default function BookCover({ title, category }: BookCoverProps) {
  const initial = title.trim().charAt(0).toUpperCase() || 'B';
  return (
    <div className={`book-cover ${coverClassFor(category)}`}>
      <span className="sheen" aria-hidden="true" />
      <span className="cover-letter" aria-hidden="true">
        {initial}
      </span>
    </div>
  );
}
