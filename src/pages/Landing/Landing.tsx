import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import styles from './Landing.module.css';

const features = [
  {
    icon: '📚',
    title: 'למידה מותאמת אישית',
    description:
      'שאלון חכם שמתאים את חוויית הלמידה בדיוק לרמה שלך - בלי מונחים מפחידים, בלי הנחות מראש.',
  },
  {
    icon: '👥',
    title: 'קהילה תומכת',
    description:
      'הצטרף לקבוצת למידה של אנשים ברמה דומה לשלך. לומדים ביחד, שואלים בחופשיות, בלי שיפוטיות.',
  },
  {
    icon: '🤖',
    title: 'עוזר AI אישי',
    description:
      'עוזר חכם שמבין את הרמה שלך ועונה בשפה שלך. תמיד זמין, תמיד סבלני, תמיד מדויק.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, profile } = useUser();

  const getCtaText = () => {
    if (user && profile) return 'המשך לקהילה';
    if (user) return 'המשך לשאלון';
    return 'בוא נתחיל - זה בחינם';
  };

  const getCtaAction = () => {
    if (user && profile) return () => navigate('/community');
    return () => navigate('/onboarding');
  };

  return (
    <PageLayout>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            ללמוד להשקיע
            <span className={styles.titleHighlight}> בלי פחד</span>
          </h1>
          <p className={styles.subtitle}>
            הפלטפורמה שהופכת את עולם ההשקעות לנגיש, מובן, ולא מפחיד.
            <br />
            למידה מותאמת אישית עם קהילה תומכת של מתחילים כמוך.
          </p>
          <div className={styles.ctaGroup}>
            <Button size="lg" onClick={getCtaAction()}>
              {getCtaText()}
            </Button>
            {!user && <p className={styles.ctaNote}>השאלון לוקח כ-3 דקות</p>}
          </div>
        </div>
      </div>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>איך זה עובד?</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <Card key={index} hoverable>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>3 דקות</span>
          <span className={styles.statLabel}>זמן השאלון</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>חינם</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>בעברית</span>
          <span className={styles.statLabel}>הכל מותאם לישראל</span>
        </div>
      </section>
    </PageLayout>
  );
}
