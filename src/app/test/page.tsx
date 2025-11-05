'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTestById } from '@/lib/data';
import { calculateTotalScore, calculateMaxScore, saveTestResponse, getRiskCategory } from '@/lib/utils';
import { Question } from '@/types';

function TestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const testId = searchParams?.get('type') || 'breast-cancer';
  
  const [test, setTest] = useState(getTestById(testId));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!test) {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, test, router]);

  // Show loading or redirect
  if (isLoading || !isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    setAnswers({ ...answers, [test.questions[currentQuestion].id]: selectedAnswer });
    
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Submit test
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[test.questions[currentQuestion - 1].id] || '');
    }
  };

  const handleSubmit = () => {
    const finalAnswers = { ...answers, [test.questions[currentQuestion].id]: selectedAnswer };
    const totalScore = calculateTotalScore(finalAnswers, test.questions);
    const maxScore = calculateMaxScore(test.questions);
    const riskCategory = getRiskCategory(totalScore, test.riskCategories);

    const response = {
      testId: test.id,
      testName: test.name,
      answers: finalAnswers,
      totalScore,
      maxScore,
      riskLevel: riskCategory?.level || 'low',
      completedAt: new Date().toISOString(),
      userId: user?.username || 'unknown',
    };

    saveTestResponse(response);
    
    // Redirect to result page
    router.push(`/result?testId=${test.id}&score=${totalScore}&maxScore=${maxScore}`);
  };

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const currentQ = test.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            Risiko {test.name}
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Jawab pertanyaan berikut untuk menilai risiko Anda
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-primary">
              {currentQuestion + 1} dari {test.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 fade-in">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  selectedAnswer === option
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswer === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            ← Kembali
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              !selectedAnswer
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-opacity-90'
            }`}
          >
            {currentQuestion === test.questions.length - 1 ? 'Selesai' : 'Lanjut →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}
