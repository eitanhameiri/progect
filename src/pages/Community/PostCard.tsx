import type { Post } from '../../types';
import { profileDefinitions } from '../../config/profiles';
import Card from '../../components/ui/Card/Card';
import CommentSection from './CommentSection';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onToggleLike: () => void;
  onToggleCommentLike: (commentId: string) => void;
  onAddComment: (content: string) => void;
  onToggleComments: () => void;
}

export default function PostCard({
  post,
  onToggleLike,
  onToggleCommentLike,
  onAddComment,
  onToggleComments,
}: PostCardProps) {
  const profileDef = profileDefinitions[post.authorProfile];

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
    <Card>
      <div className={styles.post}>
        <div className={styles.header}>
          <span className={styles.avatar}>{post.authorAvatar}</span>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.authorName}</span>
            <div className={styles.meta}>
              <span
                className={styles.profileTag}
                style={{ background: profileDef.color }}
              >
                {profileDef.name}
              </span>
              <span className={styles.date}>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <p className={styles.content}>{post.content}</p>

        <div className={styles.actions}>
          <button
            className={`${styles.likeButton} ${post.isLiked ? styles.liked : ''}`}
            onClick={onToggleLike}
          >
            {post.isLiked ? '❤️' : '🤍'} {post.likes}
          </button>
          <button className={styles.commentButton} onClick={onToggleComments}>
            💬 {post.comments.length}
          </button>
        </div>

        {post.comments.length > 0 && (
          <CommentSection
            comments={post.comments}
            isExpanded={post.commentsExpanded}
            onToggle={onToggleComments}
            onAddComment={onAddComment}
            onToggleLike={onToggleCommentLike}
          />
        )}

        {post.comments.length === 0 && post.commentsExpanded && (
          <CommentSection
            comments={[]}
            isExpanded={true}
            onToggle={onToggleComments}
            onAddComment={onAddComment}
            onToggleLike={onToggleCommentLike}
          />
        )}
      </div>
    </Card>
  );
}
