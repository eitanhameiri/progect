import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Answer, AuthUser, UserProfile, Post, Comment } from '../types';
import { calculateProfile } from '../services/profiling';
import { mockPosts } from '../services/mockData';
import * as authService from '../services/auth';

interface UserContextType {
  // Auth
  user: AuthUser | null;
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  // Data
  answers: Record<string, Answer>;
  profile: UserProfile | null;
  posts: Post[];
  setAnswer: (questionId: string, answer: Answer) => void;
  clearAnswers: () => void;
  completeProfile: () => void;
  resetProfile: () => void;
  addPost: (content: string) => void;
  toggleLike: (postId: string) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  addComment: (postId: string, content: string) => void;
  toggleComments: (postId: string) => void;
  // Reading progress
  readArticles: string[];
  markArticleRead: (articleId: string) => void;
  isArticleRead: (articleId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // Load user data from localStorage on init / login
  useEffect(() => {
    if (user) {
      const data = authService.loadUserData(user.id);
      if (data) {
        setAnswers(data.answers ?? {});
        setProfile(data.profile ?? null);
        setReadArticles(data.readArticles ?? []);
      }
    }
  }, [user]);

  // Persist data whenever answers or profile change (if logged in)
  const persistData = useCallback(
    (a: Record<string, Answer>, p: UserProfile | null, ra?: string[]) => {
      if (user) {
        authService.saveUserData(user.id, {
          answers: a,
          profile: p,
          readArticles: ra ?? readArticles,
        });
      }
    },
    [user, readArticles]
  );

  const setAnswer = (questionId: string, answer: Answer) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: answer };
      persistData(next, profile);
      return next;
    });
  };

  const clearAnswers = () => {
    setAnswers({});
    persistData({}, profile);
  };

  const completeProfile = () => {
    const userProfile = calculateProfile(answers);
    setProfile(userProfile);
    persistData(answers, userProfile);
  };

  const resetProfile = () => {
    setProfile(null);
    setAnswers({});
    persistData({}, null);
  };

  const markArticleRead = (articleId: string) => {
    setReadArticles((prev) => {
      if (prev.includes(articleId)) return prev;
      const next = [...prev, articleId];
      persistData(answers, profile, next);
      return next;
    });
  };

  const isArticleRead = (articleId: string) => readArticles.includes(articleId);

  const loginUser = (email: string, password: string) => {
    const result = authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const registerUser = (name: string, email: string, password: string) => {
    const result = authService.register(name, email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
    setAnswers({});
    setProfile(null);
    setReadArticles([]);
  };

  const addPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: user?.name ?? 'אני',
      authorAvatar: '😊',
      authorProfile: profile?.profileType ?? 'moderate',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      comments: [],
      commentsExpanded: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((c: Comment) =>
                c.id === commentId
                  ? {
                      ...c,
                      isLiked: !c.isLiked,
                      likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                    }
                  : c
              ),
            }
          : post
      )
    );
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: user?.name ?? 'אני',
      authorAvatar: '😊',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment], commentsExpanded: true }
          : post
      )
    );
  };

  const toggleComments = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, commentsExpanded: !post.commentsExpanded }
          : post
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        answers,
        profile,
        posts,
        setAnswer,
        clearAnswers,
        completeProfile,
        resetProfile,
        addPost,
        toggleLike,
        toggleCommentLike,
        addComment,
        toggleComments,
        readArticles,
        markArticleRead,
        isArticleRead,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
