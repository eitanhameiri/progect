import type { Question, CategoryInfo } from '../types';
import {
  categories as defaultCategories,
  questions as defaultQuestions,
} from '../config/questionnaire';

const CATEGORIES_KEY = 'iw_admin_categories';
const QUESTIONS_KEY = 'iw_admin_questions';

export function getCategories(): CategoryInfo[] {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to defaults
    }
  }
  return defaultCategories;
}

export function getQuestions(): Question[] {
  const raw = localStorage.getItem(QUESTIONS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to defaults
    }
  }
  return defaultQuestions;
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  return getQuestions().filter((q) => q.category === categoryId);
}

export function saveCategories(categories: CategoryInfo[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
}

export function resetToDefaults(): void {
  localStorage.removeItem(CATEGORIES_KEY);
  localStorage.removeItem(QUESTIONS_KEY);
}
