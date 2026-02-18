// Question Types
export type QuestionType = 'single' | 'multiple' | 'scale' | 'open';

export type QuestionCategory = string;

export interface QuestionOption {
  id: string;
  text: string;
  value: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category: QuestionCategory;
  options?: QuestionOption[];
  required: boolean;
  weight: number;
  minScale?: number;
  maxScale?: number;
  scaleLabels?: { min: string; max: string };
  placeholder?: string;
}

export interface CategoryInfo {
  id: QuestionCategory;
  title: string;
  description: string;
  icon: string;
  required: boolean;
}

// Answer Types
export interface Answer {
  questionId: string;
  selectedOptions?: string[];
  scaleValue?: number;
  openText?: string;
}

// Profile Types
export type ProfileType = 'conservative' | 'moderate' | 'aggressive';

export interface ProfileScores {
  riskTolerance: number;
  experience: number;
  knowledge: number;
  goalHorizon: 'short' | 'medium' | 'long';
  behaviorPattern: 'active' | 'passive' | 'balanced';
}

export interface ProfileDefinition {
  type: ProfileType;
  name: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
  color: string;
  icon: string;
}

export interface UserProfile {
  profileType: ProfileType;
  scores: ProfileScores;
  answers: Record<string, Answer>;
  personalInfo: Record<string, Answer>;
  completedAt: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// Learning Content Types
export type ArticleDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ArticleCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  difficulty: ArticleDifficulty;
  recommendedProfiles: ProfileType[];
  readingTimeMinutes: number;
  source?: string;
}

// Community Types
export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorProfile: ProfileType;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  commentsExpanded: boolean;
}
