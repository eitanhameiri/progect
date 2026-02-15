import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  narrow?: boolean;
}

export default function PageLayout({ children, narrow = false }: PageLayoutProps) {
  return (
    <main className={`${styles.layout} ${narrow ? styles.narrow : ''}`}>
      {children}
    </main>
  );
}
