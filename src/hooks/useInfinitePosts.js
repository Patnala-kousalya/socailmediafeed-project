import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../services/api';
import { transformPost } from '../utils/feedUtils';

export default function useInfinitePosts(initialLimit = 10) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const hasInitializedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadPage = useCallback(
    async (nextPage, replace = false) => {
      if (loadingRef.current) return;

      const controller = new AbortController();
      loadingRef.current = true;
      setLoading(true);
      setError('');

      try {
        const data = await fetchPosts(nextPage, initialLimit, controller.signal);

        if (!Array.isArray(data)) {
          throw new Error('Unexpected server response');
        }

        const transformed = data.map(transformPost);

        setPosts((current) => (replace ? transformed : [...current, ...transformed]));
        setPage(nextPage + 1);
        setHasMore(data.length === initialLimit);
      } catch (err) {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') {
          return;
        }
        setError('Unable to load posts right now. Please try again.');
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [initialLimit],
  );

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      void loadPage(1, true);
    }
  }, [loadPage]);

  return {
    posts,
    setPosts,
    page,
    setPage,
    loading,
    error,
    hasMore,
    setError,
    setHasMore,
    loadPage,
  };
}
