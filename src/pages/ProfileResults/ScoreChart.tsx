import type { ProfileScores } from '../../types';
import styles from './ScoreChart.module.css';

interface ScoreChartProps {
  scores: ProfileScores;
}

const dimensions = [
  { key: 'riskTolerance' as const, label: 'סובלנות סיכון' },
  { key: 'experience' as const, label: 'ניסיון' },
  { key: 'knowledge' as const, label: 'ידע' },
];

export default function ScoreChart({ scores }: ScoreChartProps) {
  return (
    <div className={styles.container}>
      {dimensions.map((dim) => (
        <div key={dim.key} className={styles.dimension}>
          <div className={styles.labelRow}>
            <span className={styles.label}>{dim.label}</span>
            <span className={styles.value}>{scores[dim.key]}%</span>
          </div>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{ width: `${scores[dim.key]}%` }}
            />
          </div>
        </div>
      ))}
      <div className={styles.extraInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>אופק השקעה</span>
          <span className={styles.infoValue}>
            {scores.goalHorizon === 'short' && 'קצר טווח'}
            {scores.goalHorizon === 'medium' && 'בינוני'}
            {scores.goalHorizon === 'long' && 'ארוך טווח'}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>דפוס התנהגות</span>
          <span className={styles.infoValue}>
            {scores.behaviorPattern === 'active' && 'אקטיבי'}
            {scores.behaviorPattern === 'passive' && 'פסיבי'}
            {scores.behaviorPattern === 'balanced' && 'מאוזן'}
          </span>
        </div>
      </div>
    </div>
  );
}
