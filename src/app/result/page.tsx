'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTestById } from '@/lib/data';
import { getRiskCategory, calculatePercentage } from '@/lib/utils';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const testId = searchParams?.get('testId') || '';
  const score = parseInt(searchParams?.get('score') || '0');
  const maxScore = parseInt(searchParams?.get('maxScore') || '10');
  
  const test = getTestById(testId);
  const riskCategory = test ? getRiskCategory(score, test.riskCategories) : null;
  const percentage = calculatePercentage(score, maxScore);

  useEffect(() => {
    if (!test || !riskCategory) {
      router.push('/');
    }
  }, [test, riskCategory, router]);

  if (!test || !riskCategory) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-danger';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-danger';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2">Hasil Tes</h1>
          <p className="text-gray-600">Risiko {test.name}</p>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              {/* Circle Progress */}
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={riskCategory.color}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getRiskColor(riskCategory.level)}`}>
                  {score}
                </span>
                <span className="text-gray-500 text-sm">/ {maxScore}</span>
              </div>
            </div>
          </div>

          <h2 className={`text-2xl font-bold mb-2 ${getRiskColor(riskCategory.level)}`}>
            {riskCategory.label}
          </h2>
          
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {riskCategory.description}
          </p>
        </div>

        {/* Risk Level Indicator */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 fade-in">
          <h3 className="font-semibold mb-4 text-center">Kategori Risiko</h3>
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-600">Rendah</span>
              <span className="text-xs text-gray-600">Sedang</span>
              <span className="text-xs text-gray-600">Tinggi</span>
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div className="bg-success flex-1"></div>
              <div className="bg-warning flex-1"></div>
              <div className="bg-danger flex-1"></div>
            </div>
            <div className="relative mt-2">
              <div
                className="absolute transform -translate-x-1/2"
                style={{ left: `${(score / maxScore) * 100}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
                  <span className="text-xs font-semibold text-gray-800 mt-1">Anda</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Link
            href="/"
            className="bg-gray-500 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            ← Beranda
          </Link>
          
          <Link
            href={`/detailinformation?testId=${testId}`}
            className="bg-secondary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            📚 Pelajari Lebih Lanjut
          </Link>
          
          <Link
            href={`/quiz?testId=${testId}`}
            className="bg-primary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            📝 Ambil Kuis
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-warning p-4 rounded fade-in">
          <p className="text-sm text-gray-700">
            <strong>Catatan:</strong> Hasil tes ini hanya untuk tujuan edukasi dan skrining awal. 
            Bukan merupakan diagnosis medis. Konsultasikan dengan dokter atau tenaga kesehatan profesional 
            untuk pemeriksaan lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
