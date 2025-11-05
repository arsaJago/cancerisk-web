'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TestResponse, QuizResponse } from '@/types';
import { getTestResponses, getQuizResponses, deleteTestResponse, deleteQuizResponse } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [testResponses, setTestResponses] = useState<TestResponse[]>([]);
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'quizzes'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login');
      return;
    }
    
    loadData();
  }, [isAuthenticated, isAdmin, router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const tests = await getTestResponses();
      const quizzes = await getQuizResponses();
      setTestResponses(tests);
      setQuizResponses(quizzes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTestResponse = async (response: TestResponse, index: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus hasil tes ini?')) {
      try {
        if (response.id) {
          // Delete from Firestore
          await deleteTestResponse(response.id);
        } else {
          // Fallback: delete from localStorage
          const updatedResponses = testResponses.filter((_, i) => i !== index);
          localStorage.setItem('testResponses', JSON.stringify(updatedResponses));
        }
        // Reload data
        await loadData();
      } catch (error) {
        console.error('Error deleting test response:', error);
        alert('Gagal menghapus data. Silakan coba lagi.');
      }
    }
  };

  const handleDeleteQuizResult = async (response: QuizResponse, index: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus hasil kuis ini?')) {
      try {
        if (response.id) {
          // Delete from Firestore
          await deleteQuizResponse(response.id);
        } else {
          // Fallback: delete from localStorage
          const updatedResponses = quizResponses.filter((_, i) => i !== index);
          localStorage.setItem('quizResults', JSON.stringify(updatedResponses));
        }
        // Reload data
        await loadData();
      } catch (error) {
        console.error('Error deleting quiz response:', error);
        alert('Gagal menghapus data. Silakan coba lagi.');
      }
    }
  };

  const exportToCSV = (type: 'test' | 'quiz') => {
    let csvContent = '';
    let filename = '';

    if (type === 'test') {
      csvContent = 'Username,Test Name,Risk Level,Score,Completed At\n';
      testResponses.forEach((response) => {
        const username = response.userId || 'N/A';
        const testName = response.testName || 'N/A';
        const riskLevel = getRiskLabel(response.riskLevel);
        const score = `${response.totalScore}/${response.maxScore}`;
        const completedAt = formatDate(response.completedAt);
        csvContent += `${username},${testName},${riskLevel},${score},${completedAt}\n`;
      });
      filename = 'test-responses.csv';
    } else {
      csvContent = 'Username,Quiz ID,Score,Completed At\n';
      quizResponses.forEach((response) => {
        const username = response.userId || 'N/A';
        const quizId = response.quizId || 'N/A';
        const score = `${response.score}/${response.totalQuestions}`;
        const completedAt = formatDate(response.completedAt);
        csvContent += `${username},${quizId},${score},${completedAt}\n`;
      });
      filename = 'quiz-responses.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'high':
        return 'bg-red-500 text-white';
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

  const getUsernameAvatar = (username: string) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const colorIndex = username.length % colors.length;
    const initial = username.charAt(0).toUpperCase();
    return (
      <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold text-sm`}>
        {initial}
      </div>
    );
  };

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

  const stats = {
    totalResponses: testResponses.length,
    totalQuizzes: quizResponses.length,
    riskLevelDistribution: {
      low: testResponses.filter((r) => r.riskLevel === 'low').length,
      medium: testResponses.filter((r) => r.riskLevel === 'medium').length,
      high: testResponses.filter((r) => r.riskLevel === 'high').length,
    },
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
          <button
            onClick={loadData}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            🔄 Refresh
          </button>
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
          <div className="space-y-6">
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
                <p className="text-3xl font-bold text-green-500">{stats.riskLevelDistribution.low}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="text-gray-600 text-sm mb-1">Risiko Sedang</h3>
                <p className="text-3xl font-bold text-yellow-500">{stats.riskLevelDistribution.medium}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">🚨</div>
                <h3 className="text-gray-600 text-sm mb-1">Risiko Tinggi</h3>
                <p className="text-3xl font-bold text-red-500">{stats.riskLevelDistribution.high}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Statistik Cepat</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tes Risiko Diselesaikan</span>
                  <span className="font-bold text-xl">{testResponses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Kuis Diselesaikan</span>
                  <span className="font-bold text-xl">{quizResponses.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Responses Tab */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Hasil Tes Risiko</h2>
              <button
                onClick={() => exportToCSV('test')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                📥 Export CSV
              </button>
            </div>
            
            {testResponses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">Belum ada hasil tes yang tersimpan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4">Username</th>
                      <th className="text-left py-3 px-4">Test Name</th>
                      <th className="text-left py-3 px-4">Risk Level</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Completed At</th>
                      <th className="text-center py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResponses.map((response, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {getUsernameAvatar(response.userId || 'N/A')}
                            <span className="font-medium">{response.userId || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{response.testName}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(response.riskLevel)}`}>
                            {getRiskLabel(response.riskLevel)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {response.totalScore}/{response.maxScore}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(response.completedAt)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteTestResponse(response, index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Quiz Responses Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Hasil Kuis</h2>
              <button
                onClick={() => exportToCSV('quiz')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                📥 Export CSV
              </button>
            </div>

            {quizResponses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">Belum ada hasil kuis yang tersimpan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4">Username</th>
                      <th className="text-left py-3 px-4">Quiz ID</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Completed At</th>
                      <th className="text-center py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResponses.map((response, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {getUsernameAvatar(response.userId || 'N/A')}
                            <span className="font-medium">{response.userId || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{response.quizId}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">
                            {response.score}/{response.totalQuestions}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(response.completedAt)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteQuizResult(response, index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
