import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { profileDefinitions } from '../../config/profiles';
import { getArticles } from '../../services/articlesService';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import styles from './Profile.module.css';

interface InvestmentHolding {
  platform: string;
  amount: number;
  assetType: string;
}

// Mock data - will be replaced with API data later
const mockHoldings: InvestmentHolding[] = [
  { platform: 'IBI', amount: 25000, assetType: 'קרן נאמנות' },
  { platform: 'מיטב', amount: 15000, assetType: 'תעודת סל' },
  { platform: 'בנק הפועלים', amount: 50000, assetType: 'פיקדון' },
  { platform: 'פסגות', amount: 10000, assetType: 'קופת גמל' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { profile, resetProfile, readArticles } = useUser();
  const allArticles = useMemo(() => getArticles(), []);

  if (!profile) {
    return (
      <PageLayout narrow>
        <div className={styles.noProfile}>
          <span className={styles.noProfileIcon}>👤</span>
          <h2>אין פרופיל עדיין</h2>
          <p>מלא את השאלון כדי לקבל פרופיל השקעות מותאם אישית</p>
          <Button onClick={() => navigate('/onboarding')}>מלא שאלון</Button>
        </div>
      </PageLayout>
    );
  }

  const definition = profileDefinitions[profile.profileType];

  const handleReset = () => {
    resetProfile();
    navigate('/onboarding');
  };

  const totalInvestments = mockHoldings.reduce((sum, h) => sum + h.amount, 0);

  return (
    <PageLayout narrow>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.icon}>{definition.icon}</span>
          <h1 className={styles.name}>{definition.name}</h1>
          <span
            className={styles.badge}
            style={{ background: definition.color }}
          >
            {definition.name}
          </span>
        </div>

        <Card>
          <h3 className={styles.sectionTitle}>תיק השקעות</h3>
          <div className={styles.holdings}>
            {mockHoldings.map((holding, i) => (
              <div key={i} className={styles.holdingItem}>
                <div className={styles.holdingPlatform}>{holding.platform}</div>
                <div className={styles.holdingDetails}>
                  <span className={styles.holdingType}>{holding.assetType}</span>
                  <span className={styles.holdingAmount}>
                    {holding.amount.toLocaleString('he-IL')} ₪
                  </span>
                </div>
              </div>
            ))}
            <div className={styles.holdingTotal}>
              <span>סה״כ</span>
              <span className={styles.holdingAmount}>
                {totalInvestments.toLocaleString('he-IL')} ₪
              </span>
            </div>
          </div>
        </Card>

        {allArticles.length > 0 && (
          <Card>
            <h3 className={styles.sectionTitle}>התקדמות למידה</h3>
            <ProgressBar
              current={readArticles.length}
              total={allArticles.length}
              label={`${readArticles.length} מתוך ${allArticles.length} מאמרים`}
            />
            <div className={styles.learnAction}>
              <Button variant="outline" size="sm" onClick={() => navigate('/learn')}>
                המשך ללמוד
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <h3 className={styles.sectionTitle}>המלצות</h3>
          <ul className={styles.recommendations}>
            {definition.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </Card>

        <div className={styles.actions}>
          <Button variant="outline" onClick={handleReset}>
            מלא שאלון מחדש
          </Button>
        </div>

        <p className={styles.completedDate}>
          שאלון הושלם:{' '}
          {new Date(profile.completedAt).toLocaleDateString('he-IL')}
        </p>
      </div>
    </PageLayout>
  );
}
