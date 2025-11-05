'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getQuizByTestId } from '@/lib/data';

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  
  const quizId = searchParams?.get('quizId') || '';
  const score = parseInt(searchParams?.get('score') || '0');
  const total = parseInt(searchParams?.get('total') || '10');
  
  const quiz = getQuizByTestId(quizId.replace('-quiz', ''));
  const percentage = Math.round((score / total) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 80) {
      return {
        emoji: '🎉',
        title: 'Luar Biasa!',
        message: 'Pemahaman Anda sangat baik! Terus jaga kesehatan dan bagikan pengetahuan ini kepada orang-orang terdekat.',
        color: 'text-success',
      };
    } else if (percentage >= 60) {
      return {
        emoji: '👍',
        title: 'Good Job!',
        message: 'Pemahaman Anda cukup baik! Terus pelajari lebih lanjut tentang pencegahan dan deteksi dini kanker payudara.',
        color: 'text-primary',
      };
    } else {
      return {
        emoji: '📚',
        title: 'Terus Belajar!',
        message: 'Anda perlu mempelajari lebih banyak tentang kanker payudara. Jangan khawatir, pengetahuan ini penting untuk kesehatan Anda.',
        color: 'text-warning',
      };
    }
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2">Hasil Kuis Pemahaman</h1>
          <p className="text-gray-600">{quiz?.title || 'Kuis Kanker Payudara'}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center fade-in">
          <div className="text-7xl mb-4">{result.emoji}</div>
          <h2 className={`text-3xl font-bold mb-2 ${result.color}`}>
            {result.title}
          </h2>
          
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#14B8A6"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-primary">{percentage}%</span>
              </div>
            </div>
          </div>

          <p className="text-2xl font-semibold mb-2">
            Skor: {score} / {total}
          </p>
          
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {result.message}
          </p>
        </div>

        {/* Detailed Results */}
        {quiz && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 fade-in">
            <h3 className="text-xl font-semibold mb-4">Detail Jawaban</h3>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border-l-4 border-primary pl-4">
                  <p className="font-medium text-gray-800 mb-1">
                    {index + 1}. {question.question}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Jawaban:</strong> {question.correctAnswer === 'myth' ? 'Mitos' : 'Fakta'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {question.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/"
            className="bg-gray-500 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            🏠 Kembali ke Beranda
          </Link>
          
          <Link
            href={`/detailinformation?testId=${quizId.replace('-quiz', '')}`}
            className="bg-primary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            📚 Pelajari Lagi
          </Link>
        </div>

        {/* Share Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg p-6 text-center fade-in">
          <h3 className="text-xl font-semibold mb-2">Bagikan Pengetahuan Ini!</h3>
          <p className="mb-4 text-sm">
            Ajak teman dan keluarga untuk lebih peduli tentang kesehatan payudara
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm">
              📱 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
