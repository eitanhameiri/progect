import type { AuthUser, Answer, UserProfile } from '../types';

const USERS_KEY = 'iw_users';
const SESSION_KEY = 'iw_session';
const DATA_PREFIX = 'iw_data_';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface UserData {
  answers: Record<string, Answer>;
  profile: UserProfile | null;
  readArticles?: string[];
}

// Simple hash for demo/testing - NOT for production
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function getUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(
  name: string,
  email: string,
  password: string
): { success: true; user: AuthUser } | { success: false; error: string } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: 'כתובת האימייל כבר רשומה במערכת' };
  }

  const newUser: StoredUser = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: simpleHash(password),
  };

  users.push(newUser);
  saveUsers(users);

  const authUser: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));

  return { success: true, user: authUser };
}

export function login(
  email: string,
  password: string
): { success: true; user: AuthUser } | { success: false; error: string } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'אימייל או סיסמה שגויים' };
  }

  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'אימייל או סיסמה שגויים' };
  }

  const authUser: AuthUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));

  return { success: true, user: authUser };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserData(userId: string, data: UserData): void {
  localStorage.setItem(DATA_PREFIX + userId, JSON.stringify(data));
}

export function loadUserData(userId: string): UserData | null {
  const raw = localStorage.getItem(DATA_PREFIX + userId);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
