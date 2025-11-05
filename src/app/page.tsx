'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { availableTests } from '@/lib/data';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <span className="text-4xl">🛡️</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Cancerisk</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Platform edukasi dan tes risiko kanker untuk membantu Anda memahami dan mencegah kanker sejak dini
            </p>
            <Link
              href="#tests"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Mulai Tes Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg card-hover bg-gray-50">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Tes Risiko</h3>
              <p className="text-gray-600">
                Evaluasi risiko kanker Anda melalui kuesioner berbasis skor yang telah tervalidasi
              </p>
            </div>
            <div className="text-center p-6 rounded-lg card-hover bg-gray-50">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Edukasi</h3>
              <p className="text-gray-600">
                Pelajari tentang kanker melalui artikel informatif dan video tutorial yang mudah dipahami
              </p>
            </div>
            <div className="text-center p-6 rounded-lg card-hover bg-gray-50">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Kuis Interaktif</h3>
              <p className="text-gray-600">
                Uji pemahaman Anda dengan kuis Mitos vs Fakta dan dapatkan feedback langsung
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tests Section */}
      <section id="tests" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Pilih Jenis Tes</h2>
          <p className="text-center text-gray-600 mb-12">
            Pilih jenis kanker yang ingin Anda ketahui risikonya
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {availableTests.map((test) => (
              <Link
                key={test.id}
                href={isAuthenticated() ? `/test?type=${test.id}` : '/login'}
                className="block"
              >
                <div className="bg-white p-6 rounded-lg shadow-md card-hover text-center">
                  <div className="text-6xl mb-4">{test.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{test.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold w-full">
                    {isAuthenticated() ? 'Mulai Tes' : 'Login untuk Mulai'}
                  </button>
                </div>
              </Link>
            ))}
            
            {/* Placeholder for more tests */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center opacity-50 cursor-not-allowed">
              <div className="text-6xl mb-4">🫁</div>
              <h3 className="text-xl font-semibold mb-2">Kanker Paru-paru</h3>
              <p className="text-gray-600 text-sm mb-4">Segera hadir</p>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-semibold w-full" disabled>
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center opacity-50 cursor-not-allowed">
              <div className="text-6xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold mb-2">Kanker Serviks</h3>
              <p className="text-gray-600 text-sm mb-4">Segera hadir</p>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-semibold w-full" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pilih Jenis Tes</h3>
                <p className="text-gray-600">Pilih jenis kanker yang ingin Anda evaluasi risikonya</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Isi Kuesioner</h3>
                <p className="text-gray-600">Jawab pertanyaan tentang gaya hidup dan riwayat kesehatan Anda</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lihat Hasil</h3>
                <p className="text-gray-600">Dapatkan hasil evaluasi risiko Anda dengan penjelasan lengkap</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Belajar</h3>
                <p className="text-gray-600">Pelajari lebih lanjut tentang pencegahan melalui artikel dan video</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Uji Pemahaman</h3>
                <p className="text-gray-600">Ambil kuis untuk menguji pemahaman Anda tentang kanker</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Mulai Perjalanan Kesehatan Anda</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Deteksi dini adalah kunci pencegahan. Yuk, kenali risiko Anda sekarang!
          </p>
          <Link
            href={isAuthenticated() ? '/test?type=breast-cancer' : '/register'}
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {isAuthenticated() ? 'Mulai Tes Risiko' : 'Daftar Sekarang'}
          </Link>
        </div>
      </section>
    </div>
  );
}
