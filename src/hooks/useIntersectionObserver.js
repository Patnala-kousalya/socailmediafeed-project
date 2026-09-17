import { useEffect, useRef, useState } from 'react';

export default function useIntersectionObserver({ enabled = true, rootMargin = '200px', threshold = 0 }) {
  const sentinelRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold, sentinelRef.current]);

  return { sentinelRef, isIntersecting };
}
