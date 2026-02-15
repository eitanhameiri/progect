import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { profileDefinitions } from '../../config/profiles';
import { questions } from '../../config/questionnaire';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import ScoreChart from '../ProfileResults/ScoreChart';
import styles from './Profile.module.css';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, resetProfile } = useUser();

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

  // Get key answers to display
  const keyAnswers = Object.entries(profile.answers)
    .filter(([, answer]) => answer.selectedOptions?.length || answer.openText)
    .slice(0, 5)
    .map(([questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return null;

      let displayAnswer = '';
      if (answer.selectedOptions?.length) {
        displayAnswer = answer.selectedOptions
          .map((optId) => question.options?.find((o) => o.id === optId)?.text)
          .filter(Boolean)
          .join(', ');
      } else if (answer.openText) {
        displayAnswer = answer.openText;
      }

      return {
        question: question.text,
        answer: displayAnswer,
      };
    })
    .filter(Boolean);

  const handleReset = () => {
    resetProfile();
    navigate('/onboarding');
  };

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
          <h3 className={styles.sectionTitle}>ניקוד</h3>
          <ScoreChart scores={profile.scores} />
        </Card>

        {keyAnswers.length > 0 && (
          <Card>
            <h3 className={styles.sectionTitle}>תשובות מרכזיות</h3>
            <div className={styles.answers}>
              {keyAnswers.map((item, i) => (
                <div key={i} className={styles.answerItem}>
                  <span className={styles.answerQuestion}>{item!.question}</span>
                  <span className={styles.answerValue}>{item!.answer}</span>
                </div>
              ))}
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
