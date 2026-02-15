import type { Post } from '../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    authorName: 'דנה כהן',
    authorAvatar: '👩‍💼',
    authorProfile: 'moderate',
    content:
      'היום למדתי מה זה ETF ואני ממש מתלהבת! בעצם זה כמו סל של מניות שאפשר לקנות ביחד, ככה מפזרים סיכון בלי צורך לבחור כל מניה בנפרד. מישהו כבר משקיע ב-ETF ויכול לשתף טיפים?',
    createdAt: '2026-02-15T10:30:00Z',
    likes: 12,
    isLiked: false,
    commentsExpanded: false,
    comments: [
      {
        id: 'c1',
        authorName: 'יוסי לוי',
        authorAvatar: '👨‍💻',
        content:
          'מעולה! אני משקיע ב-S&P 500 ETF כבר שנתיים. הדבר הכי חשוב הוא עקביות - כל חודש סכום קבוע, לא משנה מה קורה בשוק.',
        createdAt: '2026-02-15T11:15:00Z',
        likes: 5,
        isLiked: false,
      },
      {
        id: 'c2',
        authorName: 'מיכל אברהם',
        authorAvatar: '👩‍🎓',
        content: 'גם אני רק התחלתי! בואי נלמד ביחד 💪',
        createdAt: '2026-02-15T12:00:00Z',
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    authorName: 'אורי מזרחי',
    authorAvatar: '👨‍🔬',
    authorProfile: 'conservative',
    content:
      'שאלה למתחילים כמוני: מה ההבדל בין חשבון בבנק לבין ברוקר? שמעתי שאפשר לפתוח חשבון מסחר גם בבנק וגם בפלטפורמות חיצוניות. מה עדיף?',
    createdAt: '2026-02-14T16:45:00Z',
    likes: 8,
    isLiked: false,
    commentsExpanded: false,
    comments: [
      {
        id: 'c3',
        authorName: 'נועה ברקוביץ',
        authorAvatar: '👩‍💼',
        content:
          'בבנק זה יותר נוח אבל העמלות גבוהות יותר. ברוקר חיצוני כמו IB (Interactive Brokers) הרבה יותר זול, אבל צריך קצת ללמוד איך להשתמש.',
        createdAt: '2026-02-14T17:30:00Z',
        likes: 7,
        isLiked: false,
      },
    ],
  },
  {
    id: '3',
    authorName: 'שירה גולדמן',
    authorAvatar: '👩‍🏫',
    authorProfile: 'moderate',
    content:
      'טיפ שלמדתי היום: לפני שמשקיעים, חשוב לבנות "כרית ביטחון" - חיסכון של 3-6 חודשי הוצאות שנגיש בכל רגע. ככה אם קורה משהו בלתי צפוי, לא צריך למכור השקעות בהפסד.',
    createdAt: '2026-02-13T09:20:00Z',
    likes: 24,
    isLiked: false,
    commentsExpanded: false,
    comments: [
      {
        id: 'c4',
        authorName: 'עמית רוזנברג',
        authorAvatar: '👨‍💼',
        content: 'עצה מעולה! אני עדיין בונה את הכרית שלי. המטרה שלי היא 30,000 ₪ ואני כבר ב-18,000.',
        createdAt: '2026-02-13T10:00:00Z',
        likes: 4,
        isLiked: false,
      },
      {
        id: 'c5',
        authorName: 'דנה כהן',
        authorAvatar: '👩‍💼',
        content: 'כן! קראתי על זה בספר "האב העשיר, האב העני". ממש חשוב.',
        createdAt: '2026-02-13T11:30:00Z',
        likes: 2,
        isLiked: false,
      },
      {
        id: 'c6',
        authorName: 'תומר חן',
        authorAvatar: '👨‍🎨',
        content: 'אני שומר את זה בפיקדון יומי בבנק. ככה זה גם מרוויח קצת ריבית וגם נגיש.',
        createdAt: '2026-02-13T14:15:00Z',
        likes: 6,
        isLiked: false,
      },
    ],
  },
  {
    id: '4',
    authorName: 'רון אביב',
    authorAvatar: '👨‍🚀',
    authorProfile: 'aggressive',
    content:
      'מי פה עוקב אחרי שוק הקריפטו? אני מנסה להבין את הנושא אבל יש כל כך הרבה מידע שקשה לדעת מאיפה להתחיל. יש המלצה על מקורות מידע אמינים בעברית?',
    createdAt: '2026-02-12T20:00:00Z',
    likes: 15,
    isLiked: false,
    commentsExpanded: false,
    comments: [
      {
        id: 'c7',
        authorName: 'יוסי לוי',
        authorAvatar: '👨‍💻',
        content:
          'תתחיל מלהבין מה זה ביטקוין ואיתריום לפני שאתה קופץ למטבעות אחרים. יש ערוץ יוטיוב ישראלי טוב שנקרא "קריפטו בעברית".',
        createdAt: '2026-02-12T20:45:00Z',
        likes: 8,
        isLiked: false,
      },
    ],
  },
];
