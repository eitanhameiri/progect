import { useNavigate } from 'react-router-dom';
import type { Article, ArticleCategory } from '../../types';
import Card from '../../components/ui/Card/Card';
import styles from './Learn.module.css';

const difficultyLabels: Record<string, string> = {
  beginner: 'מתחיל',
  intermediate: 'בינוני',
  advanced: 'מתקדם',
};

interface ArticleCardProps {
  article: Article;
  category?: ArticleCategory;
  isRead: boolean;
}

export default function ArticleCard({ article, category, isRead }: ArticleCardProps) {
  const navigate = useNavigate();

  return (
    <Card hoverable onClick={() => navigate(`/learn/${article.id}`)}>
      <div className={styles.articleCard}>
        <div className={styles.articleHeader}>
          <span className={styles.categoryBadge}>
            {category?.icon} {category?.title}
          </span>
          <span className={`${styles.difficultyBadge} ${styles[article.difficulty]}`}>
            {difficultyLabels[article.difficulty]}
          </span>
        </div>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleSummary}>{article.summary}</p>
        <div className={styles.articleFooter}>
          <span className={styles.readingTime}>{article.readingTimeMinutes} דקות קריאה</span>
          {isRead && <span className={styles.readBadge}>נקרא</span>}
        </div>
      </div>
    </Card>
  );
}
