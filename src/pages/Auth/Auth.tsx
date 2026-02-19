import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import PageLayout from '../../components/layout/PageLayout/PageLayout';
import styles from './Auth.module.css';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const navigate = useNavigate();
  const { loginUser, registerUser, user } = useUser();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    navigate('/community');
    return null;
  }

  const validate = (): string | null => {
    if (mode === 'register' && !name.trim()) {
      return 'נא להזין שם';
    }
    if (!email.trim()) {
      return 'נא להזין אימייל';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'כתובת אימייל לא תקינה';
    }
    if (!password) {
      return 'נא להזין סיסמה';
    }
    if (password.length < 4) {
      return 'הסיסמה חייבת להכיל לפחות 4 תווים';
    }
    if (mode === 'register' && password !== confirmPassword) {
      return 'הסיסמאות לא תואמות';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (mode === 'login') {
      const result = loginUser(email, password);
      if (result.success) {
        navigate('/community');
      } else {
        setError(result.error ?? 'שגיאה בהתחברות');
      }
    } else {
      const result = registerUser(name, email, password);
      if (result.success) {
        navigate('/community');
      } else {
        setError(result.error ?? 'שגיאה בהרשמה');
      }
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <PageLayout narrow>
      <div className={styles.container}>
        <Card>
          <div className={styles.content}>
            <h1 className={styles.title}>
              {mode === 'login' ? 'התחברות' : 'הרשמה'}
            </h1>
            <p className={styles.subtitle}>
              {mode === 'login'
                ? 'התחבר כדי לראות את הנתונים שלך'
                : 'צור חשבון כדי לשמור את ההתקדמות שלך'}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {mode === 'register' && (
                <Input
                  label="שם"
                  value={name}
                  onChange={setName}
                  placeholder="השם שלך"
                />
              )}
              <Input
                label="אימייל"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="example@email.com"
              />
              <Input
                label="סיסמה"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="לפחות 4 תווים"
              />
              {mode === 'register' && (
                <Input
                  label="אימות סיסמה"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="הקלד שוב את הסיסמה"
                />
              )}

              {error && <p className={styles.error}>{error}</p>}

              <Button type="submit" fullWidth>
                {mode === 'login' ? 'התחבר' : 'הירשם'}
              </Button>
            </form>

            <p className={styles.switchText}>
              {mode === 'login' ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
              <button type="button" className={styles.switchLink} onClick={switchMode}>
                {mode === 'login' ? 'הירשם' : 'התחבר'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
