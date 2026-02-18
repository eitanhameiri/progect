import { useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { getArticles, getArticleCategories } from '../../services/articlesService';
import type { ArticleDifficulty } from '../../types';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar';
import ArticleCard from './ArticleCard';
import styles from './Learn.module.css';

export default function Learn() {
  const { profile, isArticleRead, readArticles } = useUser();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState<ArticleDifficulty | 'all'>('all');
  const [showRecommended, setShowRecommended] = useState(!!profile);

  const articles = useMemo(() => getArticles(), []);
  const categories = useMemo(() => getArticleCategories(), []);

  const filtered = useMemo(() => {
    let result = articles;

    if (showRecommended && profile) {
      result = result.filter((a) => a.recommendedProfiles.includes(profile.profileType));
    }
    if (filterCategory !== 'all') {
      result = result.filter((a) => a.categoryId === filterCategory);
    }
    if (filterDifficulty !== 'all') {
      result = result.filter((a) => a.difficulty === filterDifficulty);
    }

    return result;
  }, [articles, showRecommended, profile, filterCategory, filterDifficulty]);

  const totalArticles = articles.length;
  const readCount = readArticles.length;

  return (
    <PageLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>מרכז למידה</h1>
        <p className={styles.pageSubtitle}>מאמרים ומדריכים שיעזרו לך ללמוד על השקעות בקצב שלך</p>
      </div>

      {readCount > 0 && (
        <div className={styles.progressSection}>
          <ProgressBar current={readCount} total={totalArticles} label="התקדמות קריאה" />
        </div>
      )}

      <div className={styles.filters}>
        {profile && (
          <button
            className={`${styles.filterChip} ${showRecommended ? styles.filterChipActive : ''}`}
            onClick={() => setShowRecommended(!showRecommended)}
          >
            מומלצים לפרופיל שלי
          </button>
        )}
        <select
          className={styles.filterSelect}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">כל הקטגוריות</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.title}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value as ArticleDifficulty | 'all')}
        >
          <option value="all">כל הרמות</option>
          <option value="beginner">מתחיל</option>
          <option value="intermediate">בינוני</option>
          <option value="advanced">מתקדם</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>אין מאמרים שתואמים לסינון הנוכחי</p>
        </div>
      ) : (
        <div className={styles.articlesGrid}>
          {filtered.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              category={categories.find((c) => c.id === article.categoryId)}
              isRead={isArticleRead(article.id)}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
