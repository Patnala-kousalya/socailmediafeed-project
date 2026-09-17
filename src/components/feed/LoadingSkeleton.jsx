export default function LoadingSkeleton() {
  return (
    <div className="skeleton-list" aria-live="polite" aria-busy="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="post-card skeleton-card">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-body" />
          <div className="skeleton-line skeleton-line-body short" />
          <div className="skeleton-row">
            <div className="skeleton-pill" />
            <div className="skeleton-pill" />
          </div>
        </div>
      ))}
    </div>
  );
}
