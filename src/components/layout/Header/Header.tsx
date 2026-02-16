import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import styles from './Header.module.css';

const navItems = [
  { path: '/', label: 'בית' },
  { path: '/community', label: 'קהילה' },
  { path: '/profile', label: 'פרופיל' },
  { path: '/admin', label: 'ניהול' },
];

export default function Header() {
  const location = useLocation();
  const { user, logoutUser } = useUser();

  // Hide header during onboarding
  if (location.pathname === '/onboarding') {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>📈</span>
          <span className={styles.logoText}>InvestWise</span>
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.authSection}>
            {user ? (
              <>
                <span className={styles.userName}>{user.name}</span>
                <button className={styles.authButton} onClick={logoutUser}>
                  התנתק
                </button>
              </>
            ) : (
              <Link to="/auth" className={styles.authButton}>
                התחברות
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
