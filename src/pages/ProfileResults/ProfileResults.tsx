import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { profileDefinitions } from '../../config/profiles';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import ScoreChart from './ScoreChart';
import styles from './ProfileResults.module.css';

export default function ProfileResults() {
  const navigate = useNavigate();
  const { profile } = useUser();

  if (!profile) {
    return (
      <PageLayout narrow>
        <div className={styles.noProfile}>
          <h2>אין פרופיל עדיין</h2>
          <p>צריך למלא את השאלון קודם</p>
          <Button onClick={() => navigate('/onboarding')}>מלא שאלון</Button>
        </div>
      </PageLayout>
    );
  }

  const definition = profileDefinitions[profile.profileType];

  return (
    <PageLayout narrow>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.icon}>{definition.icon}</span>
          <h1 className={styles.title}>הפרופיל שלך</h1>
          <div
            className={styles.profileBadge}
            style={{ background: definition.color }}
          >
            {definition.name}
          </div>
        </div>

        <Card>
          <p className={styles.description}>{definition.description}</p>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>הניקוד שלך</h3>
          <ScoreChart scores={profile.scores} />
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>מאפיינים</h3>
          <ul className={styles.list}>
            {definition.characteristics.map((item, i) => (
              <li key={i} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>המלצות ראשוניות</h3>
          <ul className={styles.list}>
            {definition.recommendations.map((item, i) => (
              <li key={i} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <div className={styles.actions}>
          <Button size="lg" onClick={() => navigate('/community')}>
            הצטרף לקהילה שלך
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            צפה בפרופיל המלא
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
