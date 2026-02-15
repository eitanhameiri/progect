import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  onClick,
  selected = false,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''} ${hoverable ? styles.hoverable : ''} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
