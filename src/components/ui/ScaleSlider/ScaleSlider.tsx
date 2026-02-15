import styles from './ScaleSlider.module.css';

interface ScaleSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  labels?: { min: string; max: string };
}

export default function ScaleSlider({
  value,
  onChange,
  min,
  max,
  labels,
}: ScaleSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.value}>{value}</div>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to left, var(--primary-blue) ${percentage}%, var(--gray-200) ${percentage}%)`,
        }}
      />
      {labels && (
        <div className={styles.labels}>
          <span>{labels.max}</span>
          <span>{labels.min}</span>
        </div>
      )}
    </div>
  );
}
