const formatDate = (isoDate) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoDate));

export default function PostCard({ post, onToggleLike, onOpenComments }) {
  return (
    <article data-testid="post-card" className="post-card" key={post.id}>
      <div className="post-header">
        <div>
          <p className="post-author">User #{post.userId}</p>
          <p className="post-time">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      <h2>{post.title}</h2>
      <p className="post-body">{post.body}</p>

      <div className="post-tags" aria-label="Post hashtags">
        {post.hashtags.map((tag) => (
          <span key={`${post.id}-${tag}`} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={`like-button ${post.isLiked ? 'liked' : ''}`}
          aria-label="Like post"
          aria-pressed={post.isLiked}
          onClick={() => onToggleLike(post.id)}
        >
          <span aria-hidden="true">{post.isLiked ? '♥' : '♡'}</span>
          <span>{post.likeCount} likes</span>
        </button>

        <button
          type="button"
          className="comment-button"
          onClick={(event) => onOpenComments(post, event.currentTarget)}
          aria-label={`Comments for ${post.title}`}
        >
          💬 Comments
        </button>
      </div>
    </article>
  );
}
