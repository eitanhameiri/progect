import styles from './Input.module.css';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export default function Input({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
}: InputProps) {
  if (multiline) {
    return (
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
