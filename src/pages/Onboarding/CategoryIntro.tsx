import Button from '../../components/ui/Button/Button';
import type { CategoryInfo } from '../../types';
import styles from './CategoryIntro.module.css';

interface CategoryIntroProps {
  category: CategoryInfo;
  onStart: () => void;
  onSkip?: () => void;
}

export default function CategoryIntro({ category, onStart, onSkip }: CategoryIntroProps) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>{category.icon}</span>
      <h2 className={styles.title}>{category.title}</h2>
      <p className={styles.description}>{category.description}</p>
      <div className={styles.actions}>
        <Button onClick={onStart} size="lg">
          {category.required ? 'בוא נתחיל' : 'אני רוצה לענות'}
        </Button>
        {!category.required && onSkip && (
          <Button variant="ghost" onClick={onSkip}>
            דלג על הקטגוריה הזו
          </Button>
        )}
      </div>
      {!category.required && (
        <p className={styles.optionalNote}>
          הקטגוריה הזו אופציונלית - אפשר לדלג בלי בעיה
        </p>
      )}
    </div>
  );
}
