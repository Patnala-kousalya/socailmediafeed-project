import { useEffect, useState } from 'react';
import { fetchComments } from '../../services/api';
import Modal from '../ui/Modal';

export default function CommentModal({ post, triggerRef, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !post) {
      setComments([]);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    const loadComments = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await fetchComments(post.id, controller.signal);
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') {
          return;
        }
        setError('Unable to load comments right now.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadComments();

    return () => controller.abort();
  }, [isOpen, post]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Comments for ${post?.title || 'post'}`} triggerRef={triggerRef}>
      {isLoading && <div className="modal-status">Loading comments...</div>}
      {!isLoading && error && <div className="modal-status error">{error}</div>}
      {!isLoading && !error && comments.length === 0 && (
        <div className="modal-status">No comments available for this post.</div>
      )}
      {!isLoading && !error && comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.name}</strong>
                <span>{comment.email}</span>
              </div>
              <p>{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
