import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { getArticleById, getArticleCategories } from '../../services/articlesService';
import Button from '../../components/ui/Button/Button';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import styles from './ArticlePage.module.css';

const difficultyLabels: Record<string, string> = {
  beginner: 'מתחיל',
  intermediate: 'בינוני',
  advanced: 'מתקדם',
};

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const headerCells = tableRows[0].split('|').filter(Boolean).map((c) => c.trim());
    const bodyRows = tableRows.slice(2); // skip header + separator
    elements.push(
      <table key={`table-${elements.length}`} className={styles.table}>
        <thead>
          <tr>{headerCells.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {row.split('|').filter(Boolean).map((cell, ci) => (
                <td key={ci}>{cell.trim()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith('|')) {
      inTable = true;
      tableRows.push(line.trim());
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className={styles.h3}>{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className={styles.h2}>{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      // skip top-level heading (used as page title)
      continue;
    } else if (line.startsWith('- **')) {
      // bold list item
      const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
      if (match) {
        elements.push(
          <li key={i} className={styles.listItem}>
            <strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}
          </li>
        );
      }
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} className={styles.listItem}>{line.slice(2)}</li>);
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<li key={i} className={styles.listItem}>{line.replace(/^\d+\.\s/, '')}</li>);
    } else if (line.trim() === '') {
      // skip empty lines
      continue;
    } else {
      // Regular paragraph - handle inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={i} className={styles.paragraph}>
          {parts.map((part, pi) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={pi}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    }
  }

  // Flush remaining table
  if (inTable) flushTable();

  return elements;
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markArticleRead, isArticleRead } = useUser();

  const article = useMemo(() => (id ? getArticleById(id) : undefined), [id]);
  const categories = useMemo(() => getArticleCategories(), []);
  const category = categories.find((c) => c.id === article?.categoryId);

  useEffect(() => {
    if (article) {
      markArticleRead(article.id);
    }
  }, [article, markArticleRead]);

  if (!article) {
    return (
      <PageLayout narrow>
        <div className={styles.notFound}>
          <h2>מאמר לא נמצא</h2>
          <Button onClick={() => navigate('/learn')}>חזרה למרכז הלמידה</Button>
        </div>
      </PageLayout>
    );
  }

  const read = isArticleRead(article.id);

  return (
    <PageLayout narrow>
      <div className={styles.container}>
        <button className={styles.backLink} onClick={() => navigate('/learn')}>
          ← חזרה למרכז הלמידה
        </button>

        <div className={styles.meta}>
          <span className={styles.categoryBadge}>
            {category?.icon} {category?.title}
          </span>
          <span className={`${styles.difficultyBadge} ${styles[article.difficulty]}`}>
            {difficultyLabels[article.difficulty]}
          </span>
          <span className={styles.readingTime}>{article.readingTimeMinutes} דקות קריאה</span>
          {read && <span className={styles.readBadge}>נקרא</span>}
        </div>

        <h1 className={styles.title}>{article.title}</h1>

        {article.source && (
          <p className={styles.source}>מקור: {article.source}</p>
        )}

        <div className={styles.content}>
          {renderMarkdown(article.content)}
        </div>

        <div className={styles.footer}>
          <Button variant="outline" onClick={() => navigate('/learn')}>
            חזרה למרכז הלמידה
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
