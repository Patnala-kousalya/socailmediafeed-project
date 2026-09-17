import { useEffect, useMemo, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import useInfinitePosts from '../../hooks/useInfinitePosts';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { patchPostLike } from '../../services/api';
import { getHashtagSuggestions, matchesSearch, sortPosts } from '../../utils/feedUtils';
import CommentModal from './CommentModal';
import LoadingSkeleton from './LoadingSkeleton';
import PostCard from './PostCard';
import SearchBar from '../ui/SearchBar';
import Toast from '../ui/Toast';

const SORT_OPTIONS = {
  all: 'All Posts',
  popular: 'Popular',
  recent: 'Recent',
};

export default function Feed() {
  const { posts, setPosts, page, loading, error, hasMore, loadPage } = useInfinitePosts(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [toasts, setToasts] = useState([]);
  const commentButtonRef = useRef(null);
  const debouncedSearch = useDebounce(searchTerm, 400);

  const openComments = (post, triggerElement) => {
    setSelectedPost(post);
    commentButtonRef.current = triggerElement;
  };

  const { sentinelRef, isIntersecting } = useIntersectionObserver({
    enabled: true,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (isIntersecting && !loading && hasMore && posts.length > 0) {
      void loadPage(page, false);
    }
  }, [isIntersecting, loading, hasMore, page, posts.length, loadPage]);

  const filteredPosts = useMemo(() => {
    const visiblePosts = posts.filter((post) => matchesSearch(post, debouncedSearch));
    return sortPosts(visiblePosts, sortBy);
  }, [posts, debouncedSearch, sortBy]);

  const suggestions = useMemo(
    () => getHashtagSuggestions(posts, searchTerm),
    [posts, searchTerm],
  );

  const showToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const handleToggleLike = async (postId) => {
    const previous = posts.find((post) => post.id === postId);
    if (!previous) return;

    const nextIsLiked = !previous.isLiked;
    const nextLikeCount = Math.max(0, previous.likeCount + (nextIsLiked ? 1 : -1));

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: nextIsLiked,
              likeCount: nextLikeCount,
            }
          : post,
      ),
    );

    try {
      await patchPostLike(postId, { isLiked: nextIsLiked, likeCount: nextLikeCount });
      showToast('success', 'Post liked successfully');
    } catch (err) {
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: previous.isLiked,
                likeCount: previous.likeCount,
              }
            : post,
        ),
      );
      showToast('error', 'Failed to update like status.');
    }
  };

  const showInitialSkeleton = posts.length === 0 && loading;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Community Pulse</p>
            <h1>Social Feed</h1>
          </div>
        </div>
      </header>

      <main className="feed-container">
        <section className="toolbar" aria-label="Feed controls">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            suggestions={suggestions}
            onSuggestionSelect={(value) => setSearchTerm(value)}
          />

          <div className="sort-wrap">
            <label htmlFor="sort-posts">Sort</label>
            <select id="sort-posts" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {showInitialSkeleton && <LoadingSkeleton />}

        {!showInitialSkeleton && error && (
          <div className="inline-message error" role="alert">
            {error}
            <button type="button" onClick={() => void loadPage(page, false)}>
              Try again
            </button>
          </div>
        )}

        {!showInitialSkeleton && filteredPosts.length === 0 && (
          <div className="empty-state" role="status">
            <h3>No posts found matching your search.</h3>
            <button type="button" onClick={() => setSearchTerm('')}>
              Clear search
            </button>
          </div>
        )}

        {!showInitialSkeleton && filteredPosts.length > 0 && (
          <div className="feed-list">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                onOpenComments={openComments}
              />
            ))}
          </div>
        )}

        {loading && <div className="scroll-loader">Loading more posts...</div>}

        {!loading && hasMore && !showInitialSkeleton && filteredPosts.length > 0 && (
          <div ref={sentinelRef} className="sentinel" aria-hidden="true" />
        )}
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />

      <CommentModal
        post={selectedPost}
        triggerRef={commentButtonRef}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
