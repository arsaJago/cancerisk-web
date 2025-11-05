'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getQuizByTestId, getTestById } from '@/lib/data';
import { saveQuizResponse } from '@/lib/utils';

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams?.get('testId') || 'breast-cancer';
  
  const test = getTestById(testId);
  const quiz = getQuizByTestId(testId);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: 'myth' | 'fact' }>({});
  const [selectedAnswer, setSelectedAnswer] = useState<'myth' | 'fact' | ''>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!quiz || !test) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Kuis tidak ditemukan</p>
          <a href="/" className="text-primary hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answer: 'myth' | 'fact') => {
    if (showFeedback) return; // Prevent changing answer after feedback shown
    
    setSelectedAnswer(answer);
    const correct = answer === currentQ.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswers({ ...answers, [currentQ.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[quiz.questions[currentQuestion + 1].id] || '');
      setShowFeedback(false);
    } else {
      // Submit quiz
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const correctCount = Object.entries(answers).filter(
      ([questionId, answer]) => {
        const question = quiz.questions.find((q) => q.id === parseInt(questionId));
        return question?.correctAnswer === answer;
      }
    ).length;

    const quizResponse = {
      quizId: quiz.id,
      answers,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      completedAt: new Date().toISOString(),
    };

    saveQuizResponse(quizResponse);
    
    // Redirect to quiz result page
    router.push(`/quiz-result?quizId=${quiz.id}&score=${correctCount}&total=${quiz.questions.length}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Jawab pertanyaan berikut untuk menilai pemahaman Anda
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-primary">
              {currentQuestion + 1} dari {quiz.questions.length}
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
          <div className="mb-2 text-sm text-gray-500">
            Mitos atau Fakta?
          </div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswerSelect('myth')}
              disabled={showFeedback}
              className={`p-6 text-center rounded-lg border-2 transition font-semibold ${
                selectedAnswer === 'myth'
                  ? showFeedback
                    ? isCorrect
                      ? 'border-success bg-success bg-opacity-10 text-success'
                      : 'border-danger bg-danger bg-opacity-10 text-danger'
                    : 'border-primary bg-primary bg-opacity-10 text-primary'
                  : 'border-gray-200 hover:border-primary hover:bg-gray-50'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-3xl mb-2">❌</div>
              <div>Mitos</div>
            </button>

            <button
              onClick={() => handleAnswerSelect('fact')}
              disabled={showFeedback}
              className={`p-6 text-center rounded-lg border-2 transition font-semibold ${
                selectedAnswer === 'fact'
                  ? showFeedback
                    ? isCorrect
                      ? 'border-success bg-success bg-opacity-10 text-success'
                      : 'border-danger bg-danger bg-opacity-10 text-danger'
                    : 'border-primary bg-primary bg-opacity-10 text-primary'
                  : 'border-gray-200 hover:border-primary hover:bg-gray-50'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-3xl mb-2">✅</div>
              <div>Fakta</div>
            </button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3">{isCorrect ? '✅' : '❌'}</span>
                <div>
                  <h3 className="font-semibold mb-2">
                    {isCorrect ? 'Benar!' : 'Kurang Tepat'}
                  </h3>
                  <p className="text-sm">
                    <strong>Penjelasan:</strong> {currentQ.explanation}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm mt-2">
                      <strong>Jawaban yang benar:</strong>{' '}
                      {currentQ.correctAnswer === 'myth' ? 'Mitos' : 'Fakta'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!showFeedback}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              !showFeedback
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-opacity-90'
            }`}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Lihat Hasil →' : 'Lanjut →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
