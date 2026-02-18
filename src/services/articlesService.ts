import type { Article, ArticleCategory } from '../types';
import {
  defaultArticles,
  articleCategories as defaultCategories,
} from '../config/articles';

const ARTICLES_KEY = 'iw_admin_articles';
const ARTICLE_CATEGORIES_KEY = 'iw_admin_article_categories';

export function getArticleCategories(): ArticleCategory[] {
  const raw = localStorage.getItem(ARTICLE_CATEGORIES_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through
    }
  }
  return defaultCategories;
}

export function getArticles(): Article[] {
  const raw = localStorage.getItem(ARTICLES_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through
    }
  }
  return defaultArticles;
}

export function getArticleById(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

export function getArticlesByCategory(categoryId: string): Article[] {
  return getArticles().filter((a) => a.categoryId === categoryId);
}

export function saveArticles(articles: Article[]): void {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

export function saveArticleCategories(categories: ArticleCategory[]): void {
  localStorage.setItem(ARTICLE_CATEGORIES_KEY, JSON.stringify(categories));
}

export function resetArticlesToDefaults(): void {
  localStorage.removeItem(ARTICLES_KEY);
  localStorage.removeItem(ARTICLE_CATEGORIES_KEY);
}
