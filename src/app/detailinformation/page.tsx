'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getEducationByTestId, getTestById } from '@/lib/data';

export default function DetailInformationPage() {
  const searchParams = useSearchParams();
  const testId = searchParams?.get('testId') || 'breast-cancer';
  
  const test = getTestById(testId);
  const educationContent = getEducationByTestId(testId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2">Informasi Kesehatan</h1>
          <p className="text-gray-600">Risiko {test?.name || 'Kanker Payudara'}</p>
        </div>

        {/* Navigation breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link href="/" className="text-primary hover:underline">Beranda</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">Informasi Kesehatan</span>
          </nav>
        </div>

        {/* Educational Content */}
        <div className="space-y-6">
          {educationContent.map((content, index) => (
            <div key={content.id} className="bg-white rounded-lg shadow-md p-6 fade-in">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{content.title}</h2>
              
              {content.type === 'video' && content.videoUrl && (
                <div className="mb-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={content.videoUrl}
                      title={content.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {content.duration && (
                    <p className="text-sm text-gray-500 mt-2">Durasi: {content.duration}</p>
                  )}
                </div>
              )}
              
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg p-8 text-center fade-in">
          <h2 className="text-2xl font-bold mb-4">Uji Pemahaman Anda Sekarang</h2>
          <p className="mb-6 text-lg">
            Setelah mempelajari tentang kanker payudara, saatnya menguji pemahaman Anda dengan kuis interaktif!
          </p>
          <Link
            href={`/quiz?testId=${testId}`}
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            📝 Mulai Kuis Pemahaman
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-primary hover:underline"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
