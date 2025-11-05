import { TestResponse, QuizResponse } from '@/types';

// Fungsi untuk menyimpan hasil tes ke localStorage
export const saveTestResponse = (response: TestResponse): void => {
  if (typeof window === 'undefined') return;
  
  const responses = getTestResponses();
  responses.push(response);
  localStorage.setItem('testResponses', JSON.stringify(responses));
};

// Fungsi untuk mengambil semua hasil tes dari localStorage
export const getTestResponses = (): TestResponse[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem('testResponses');
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menyimpan hasil kuis ke localStorage
export const saveQuizResponse = (response: QuizResponse): void => {
  if (typeof window === 'undefined') return;
  
  const responses = getQuizResponses();
  responses.push(response);
  localStorage.setItem('quizResponses', JSON.stringify(responses));
};

// Fungsi untuk mengambil semua hasil kuis dari localStorage
export const getQuizResponses = (): QuizResponse[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem('quizResponses');
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menghitung total skor dari jawaban
export const calculateTotalScore = (
  answers: { [questionId: number]: string },
  questions: any[]
): number => {
  let total = 0;
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find((q) => q.id === parseInt(questionId));
    if (question && question.points[answer] !== undefined) {
      total += question.points[answer];
    }
  });
  
  return total;
};

// Fungsi untuk mendapatkan kategori risiko berdasarkan skor
export const getRiskCategory = (score: number, categories: any[]) => {
  return categories.find((cat) => score >= cat.min && score <= cat.max);
};

// Fungsi untuk menghitung skor maksimal dari kuesioner
export const calculateMaxScore = (questions: any[]): number => {
  return questions.reduce((max, question) => {
    const maxPoints = Math.max(...Object.values(question.points) as number[]);
    return max + maxPoints;
  }, 0);
};

// Fungsi untuk menghitung persentase skor
export const calculatePercentage = (score: number, maxScore: number): number => {
  return Math.round((score / maxScore) * 100);
};

// Fungsi untuk format tanggal
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Fungsi untuk clear all data (untuk testing)
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('testResponses');
  localStorage.removeItem('quizResponses');
};
