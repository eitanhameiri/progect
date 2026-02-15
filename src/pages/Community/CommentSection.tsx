import { useState } from 'react';
import type { Comment } from '../../types';
import Button from '../../components/ui/Button/Button';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  comments: Comment[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddComment: (content: string) => void;
  onToggleLike: (commentId: string) => void;
}

export default function CommentSection({
  comments,
  isExpanded,
  onToggle,
  onAddComment,
  onToggleLike,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'עכשיו';
    if (hours < 24) return `לפני ${hours} שעות`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'אתמול';
    return `לפני ${days} ימים`;
  };

  return (
    <div className={styles.container}>
      <button className={styles.toggleButton} onClick={onToggle}>
        {isExpanded
          ? 'הסתר תגובות'
          : `${comments.length} תגובות`}
      </button>

      {isExpanded && (
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.avatar}>{comment.authorAvatar}</span>
                <span className={styles.authorName}>{comment.authorName}</span>
                <span className={styles.date}>{formatDate(comment.createdAt)}</span>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
              <button
                className={`${styles.likeButton} ${comment.isLiked ? styles.liked : ''}`}
                onClick={() => onToggleLike(comment.id)}
              >
                {comment.isLiked ? '❤️' : '🤍'} {comment.likes}
              </button>
            </div>
          ))}

          <div className={styles.addComment}>
            <input
              type="text"
              className={styles.commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="הוסף תגובה..."
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
            >
              שלח
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
