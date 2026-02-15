import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Answer, UserProfile, Post, Comment } from '../types';
import { calculateProfile } from '../services/profiling';
import { mockPosts } from '../services/mockData';

interface UserContextType {
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const setAnswer = (questionId: string, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const clearAnswers = () => {
    setAnswers({});
  };

  const completeProfile = () => {
    const userProfile = calculateProfile(answers);
    setProfile(userProfile);
  };

  const resetProfile = () => {
    setProfile(null);
    setAnswers({});
  };

  const addPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: 'אני',
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
      authorName: 'אני',
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
