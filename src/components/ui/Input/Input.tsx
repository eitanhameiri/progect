import styles from './Input.module.css';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'email' | 'password';
  label?: string;
  error?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  type = 'text',
  label,
  error,
}: InputProps) {
  const inputClass = `${styles.input} ${error ? styles.inputError : ''}`;

  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {multiline ? (
        <textarea
          className={`${inputClass} ${styles.textarea}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
