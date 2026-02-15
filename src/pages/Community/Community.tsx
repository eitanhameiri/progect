import { useUser } from '../../context/UserContext';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import styles from './Community.module.css';

export default function Community() {
  const { posts, addPost, toggleLike, toggleCommentLike, addComment, toggleComments } =
    useUser();

  return (
    <PageLayout narrow>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>קהילת למידה</h1>
          <p className={styles.subtitle}>
            מקום בטוח לשאול, לשתף, וללמוד ביחד
          </p>
        </div>

        <CreatePost onSubmit={addPost} />

        <div className={styles.feed}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={() => toggleLike(post.id)}
              onToggleCommentLike={(commentId) =>
                toggleCommentLike(post.id, commentId)
              }
              onAddComment={(content) => addComment(post.id, content)}
              onToggleComments={() => toggleComments(post.id)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
