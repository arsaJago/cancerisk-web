// Types untuk aplikasi Cancerisk

export interface Question {
  id: number;
  question: string;
  type: 'yes-no' | 'multiple-choice' | 'scale';
  options?: string[];
  points: { [key: string]: number };
}

export interface RiskTest {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: Question[];
  riskCategories: RiskCategory[];
}

export interface RiskCategory {
  min: number;
  max: number;
  level: 'low' | 'medium' | 'high';
  label: string;
  description: string;
  color: string;
}

export interface TestResponse {
  testId: string;
  testName: string;
  answers: { [questionId: number]: string };
  totalScore: number;
  maxScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  completedAt: string;
  userId?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'myth-fact';
  correctAnswer: 'myth' | 'fact';
  explanation: string;
}

export interface Quiz {
  id: string;
  testId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  quizId: string;
  answers: { [questionId: number]: 'myth' | 'fact' };
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface EducationalContent {
  id: string;
  testId: string;
  title: string;
  type: 'article' | 'video';
  content: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
}

export interface AdminStats {
  totalResponses: number;
  testBreakdown: { [testId: string]: number };
  riskLevelDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  recentResponses: TestResponse[];
}
