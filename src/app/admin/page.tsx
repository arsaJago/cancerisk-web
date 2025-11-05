'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTestResponses, getQuizResponses, formatDate, clearAllData } from '@/lib/utils';
import { TestResponse, QuizResponse, AdminStats } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [testResponses, setTestResponses] = useState<TestResponse[]>([]);
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'quizzes'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login');
      return;
    }
    
    loadData();
    setIsLoading(false);
  }, [isAuthenticated, isAdmin, router]);

  const loadData = () => {
    setTestResponses(getTestResponses());
    setQuizResponses(getQuizResponses());
  };

  const handleClearData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      clearAllData();
      loadData();
    }
  };

  // Show loading or redirect
  if (isLoading || !isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats: AdminStats = {
    totalResponses: testResponses.length,
    testBreakdown: testResponses.reduce((acc, response) => {
      acc[response.testId] = (acc[response.testId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
    riskLevelDistribution: {
      low: testResponses.filter((r) => r.riskLevel === 'low').length,
      medium: testResponses.filter((r) => r.riskLevel === 'medium').length,
      high: testResponses.filter((r) => r.riskLevel === 'high').length,
    },
    recentResponses: testResponses.slice(-10).reverse(),
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-success text-white';
      case 'medium':
        return 'bg-warning text-white';
      case 'high':
        return 'bg-danger text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low':
        return 'Rendah';
      case 'medium':
        return 'Sedang';
      case 'high':
        return 'Tinggi';
      default:
        return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Kelola dan lihat hasil respon responden</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadData}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleClearData}
              className="bg-danger text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              🗑️ Hapus Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'tests'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              🔬 Hasil Tes Risiko ({testResponses.length})
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'quizzes'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              📝 Hasil Kuis ({quizResponses.length})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 fade-in">
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-gray-600 text-sm mb-1">Total Responden Tes</h3>
                <p className="text-3xl font-bold text-primary">{stats.totalResponses}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-gray-600 text-sm mb-1">Risiko Rendah</h3>
                <p className="text-3xl font-bold text-success">{stats.riskLevelDistribution.low}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="text-gray-600 text-sm mb-1">Risiko Sedang</h3>
                <p className="text-3xl font-bold text-warning">{stats.riskLevelDistribution.medium}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">🚨</div>
                <h3 className="text-gray-600 text-sm mb-1">Risiko Tinggi</h3>
                <p className="text-3xl font-bold text-danger">{stats.riskLevelDistribution.high}</p>
              </div>
            </div>

            {/* Risk Distribution Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Distribusi Tingkat Risiko</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Risiko Rendah</span>
                    <span className="text-sm font-medium">{stats.riskLevelDistribution.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-success h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.totalResponses > 0
                            ? (stats.riskLevelDistribution.low / stats.totalResponses) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Risiko Sedang</span>
                    <span className="text-sm font-medium">{stats.riskLevelDistribution.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-warning h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.totalResponses > 0
                            ? (stats.riskLevelDistribution.medium / stats.totalResponses) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Risiko Tinggi</span>
                    <span className="text-sm font-medium">{stats.riskLevelDistribution.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-danger h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.totalResponses > 0
                            ? (stats.riskLevelDistribution.high / stats.totalResponses) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Responses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Respon Terbaru</h2>
              {stats.recentResponses.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentResponses.map((response, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{response.testName}</h3>
                        <p className="text-sm text-gray-600">{formatDate(response.completedAt)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold">
                          {response.totalScore}/{response.maxScore}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(
                            response.riskLevel
                          )}`}
                        >
                          {getRiskLabel(response.riskLevel)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Belum ada respon</p>
              )}
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-lg shadow-md p-6 fade-in">
            <h2 className="text-xl font-semibold mb-4">Semua Hasil Tes Risiko</h2>
            {testResponses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        #
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Jenis Tes
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Skor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Tingkat Risiko
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResponses.map((response, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{index + 1}</td>
                        <td className="py-3 px-4 text-sm font-medium">{response.testName}</td>
                        <td className="py-3 px-4 text-sm">
                          {response.totalScore}/{response.maxScore}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(
                              response.riskLevel
                            )}`}
                          >
                            {getRiskLabel(response.riskLevel)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(response.completedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada data tes</p>
            )}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-lg shadow-md p-6 fade-in">
            <h2 className="text-xl font-semibold mb-4">Semua Hasil Kuis</h2>
            {quizResponses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        #
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        ID Kuis
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Skor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Persentase
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResponses.map((response, index) => {
                      const percentage = Math.round((response.score / response.totalQuestions) * 100);
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{index + 1}</td>
                          <td className="py-3 px-4 text-sm font-medium">{response.quizId}</td>
                          <td className="py-3 px-4 text-sm">
                            {response.score}/{response.totalQuestions}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                percentage >= 80
                                  ? 'bg-success text-white'
                                  : percentage >= 60
                                  ? 'bg-primary text-white'
                                  : 'bg-warning text-white'
                              }`}
                            >
                              {percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(response.completedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada data kuis</p>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
