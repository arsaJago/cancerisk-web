import { TestResponse, QuizResponse } from '@/types';
import { db, isFirebaseEnabled } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

// Fungsi untuk menyimpan hasil tes (Firestore atau localStorage)
export const saveTestResponse = async (response: TestResponse): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // Try Firestore first
  if (isFirebaseEnabled() && db) {
    try {
      await addDoc(collection(db, 'testResponses'), {
        ...response,
        createdAt: Timestamp.now(),
      });
      console.log('✅ Test response saved to Firestore');
      return;
    } catch (error) {
      console.error('❌ Error saving to Firestore, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const responses = await getTestResponses();
  responses.push(response);
  localStorage.setItem('testResponses', JSON.stringify(responses));
};

// Fungsi untuk mengambil semua hasil tes (Firestore atau localStorage)
export const getTestResponses = async (): Promise<TestResponse[]> => {
  if (typeof window === 'undefined') return [];
  
  // Try Firestore first
  if (isFirebaseEnabled() && db) {
    try {
      const q = query(collection(db, 'testResponses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const responses: TestResponse[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        responses.push({
          testId: data.testId,
          testName: data.testName,
          answers: data.answers,
          totalScore: data.totalScore,
          maxScore: data.maxScore,
          riskLevel: data.riskLevel,
          completedAt: data.completedAt,
          userId: data.userId,
          id: doc.id, // Store Firestore doc ID for deletion
        } as TestResponse);
      });
      console.log(`✅ Loaded ${responses.length} test responses from Firestore`);
      return responses;
    } catch (error) {
      console.error('❌ Error loading from Firestore, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem('testResponses');
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menghapus hasil tes dari Firestore
export const deleteTestResponse = async (responseId: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  if (isFirebaseEnabled() && db) {
    try {
      await deleteDoc(doc(db, 'testResponses', responseId));
      console.log('✅ Test response deleted from Firestore');
    } catch (error) {
      console.error('❌ Error deleting from Firestore:', error);
      throw error;
    }
  }
};

// Fungsi untuk menyimpan hasil kuis (Firestore atau localStorage)
export const saveQuizResponse = async (response: QuizResponse): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // Try Firestore first
  if (isFirebaseEnabled() && db) {
    try {
      await addDoc(collection(db, 'quizResponses'), {
        ...response,
        createdAt: Timestamp.now(),
      });
      console.log('✅ Quiz response saved to Firestore');
      return;
    } catch (error) {
      console.error('❌ Error saving to Firestore, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const responses = await getQuizResponses();
  responses.push(response);
  localStorage.setItem('quizResponses', JSON.stringify(responses));
};

// Fungsi untuk mengambil semua hasil kuis (Firestore atau localStorage)
export const getQuizResponses = async (): Promise<QuizResponse[]> => {
  if (typeof window === 'undefined') return [];
  
  // Try Firestore first
  if (isFirebaseEnabled() && db) {
    try {
      const q = query(collection(db, 'quizResponses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const responses: QuizResponse[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        responses.push({
          quizId: data.quizId,
          answers: data.answers,
          score: data.score,
          totalQuestions: data.totalQuestions,
          completedAt: data.completedAt,
          userId: data.userId,
          id: doc.id, // Store Firestore doc ID for deletion
        } as QuizResponse);
      });
      console.log(`✅ Loaded ${responses.length} quiz responses from Firestore`);
      return responses;
    } catch (error) {
      console.error('❌ Error loading from Firestore, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem('quizResponses');
  return data ? JSON.parse(data) : [];
};

// Fungsi untuk menghapus hasil kuis dari Firestore
export const deleteQuizResponse = async (responseId: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  if (isFirebaseEnabled() && db) {
    try {
      await deleteDoc(doc(db, 'quizResponses', responseId));
      console.log('✅ Quiz response deleted from Firestore');
    } catch (error) {
      console.error('❌ Error deleting from Firestore:', error);
      throw error;
    }
  }
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
