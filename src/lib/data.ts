import { RiskTest, Quiz, EducationalContent } from '@/types';

// Data Tes Risiko Kanker Payudara
export const breastCancerTest: RiskTest = {
  id: 'breast-cancer',
  name: 'Kanker Payudara',
  description: 'Tes risiko kanker payudara untuk wanita',
  icon: '🎗️',
  questions: [
    {
      id: 1,
      question: 'Berapa usia Anda saat ini?',
      type: 'multiple-choice',
      options: ['< 30 tahun', '30-40 tahun', '40-50 tahun', '> 50 tahun'],
      points: {
        '< 30 tahun': 0,
        '30-40 tahun': 1,
        '40-50 tahun': 2,
        '> 50 tahun': 3,
      },
    },
    {
      id: 2,
      question: 'Apakah ada riwayat keluarga dengan kanker payudara?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 3,
        'Tidak': 0,
      },
    },
    {
      id: 3,
      question: 'Apakah Anda pernah menjalani terapi radiasi di bagian dada saat masih muda?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 2,
        'Tidak': 0,
      },
    },
    {
      id: 4,
      question: 'Apakah Anda memiliki mutasi genetik (BRCA1/BRCA2)?',
      type: 'multiple-choice',
      options: ['Ya, terbukti', 'Tidak tahu', 'Tidak'],
      points: {
        'Ya, terbukti': 4,
        'Tidak tahu': 1,
        'Tidak': 0,
      },
    },
    {
      id: 5,
      question: 'Apakah Anda mengalami menstruasi dini atau menopause terlambat?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 1,
        'Tidak': 0,
      },
    },
    {
      id: 6,
      question: 'Apakah Anda pernah melahirkan atau melahirkan di usia > 30 tahun?',
      type: 'multiple-choice',
      options: ['Tidak pernah melahirkan', 'Melahirkan > 30 tahun', 'Melahirkan < 30 tahun'],
      points: {
        'Tidak pernah melahirkan': 2,
        'Melahirkan > 30 tahun': 1,
        'Melahirkan < 30 tahun': 0,
      },
    },
    {
      id: 7,
      question: 'Apakah Anda mengonsumsi alkohol secara rutin?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 1,
        'Tidak': 0,
      },
    },
    {
      id: 8,
      question: 'Apakah Anda memiliki berat badan berlebih atau obesitas?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 1,
        'Tidak': 0,
      },
    },
    {
      id: 9,
      question: 'Apakah Anda jarang berolahraga atau kurang aktif fisik?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 1,
        'Tidak': 0,
      },
    },
    {
      id: 10,
      question: 'Apakah Anda pernah menggunakan terapi hormon pascamenopause?',
      type: 'yes-no',
      options: ['Ya', 'Tidak'],
      points: {
        'Ya': 2,
        'Tidak': 0,
      },
    },
  ],
  riskCategories: [
    {
      min: 0,
      max: 5,
      level: 'low',
      label: 'Risiko Rendah',
      description: 'Berdasarkan jawaban Anda, saat ini Anda memiliki risiko rendah terhadap kanker payudara. Tetap jaga gaya hidup sehat, konsumsi makanan bergizi, lakukan aktivitas fisik secara rutin, dan pertimbangkan skrining mammografi sesuai anjuran usia.',
      color: '#10B981',
    },
    {
      min: 6,
      max: 12,
      level: 'medium',
      label: 'Risiko Sedang',
      description: 'Anda memiliki beberapa faktor risiko kanker payudara. Disarankan untuk berkonsultasi dengan dokter, melakukan pemeriksaan payudara sendiri (SADARI) secara rutin, dan mempertimbangkan skrining mammografi.',
      color: '#F59E0B',
    },
    {
      min: 13,
      max: 20,
      level: 'high',
      label: 'Risiko Tinggi',
      description: 'Berdasarkan jawaban Anda, Anda memiliki risiko tinggi terhadap kanker payudara. Sangat disarankan untuk segera berkonsultasi dengan dokter spesialis untuk pemeriksaan lebih lanjut dan perencanaan pencegahan yang tepat.',
      color: '#EF4444',
    },
  ],
};

// Kuis Pemahaman Kanker Payudara
export const breastCancerQuiz: Quiz = {
  id: 'breast-cancer-quiz',
  testId: 'breast-cancer',
  title: 'Uji Pemahaman Kanker Payudara',
  questions: [
    {
      id: 1,
      question: 'Makan makanan berlemak dan jarang olahraga bisa meningkatkan risiko kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'fact',
      explanation: 'Gaya hidup tidak sehat, termasuk konsumsi tinggi lemak dan kurang aktivitas fisik, meningkatkan kadar estrogen dan risiko kanker payudara (Kemenkes RI, 2023).',
    },
    {
      id: 2,
      question: 'Hanya wanita yang bisa terkena kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'myth',
      explanation: 'Meskipun jarang, pria juga dapat terkena kanker payudara karena memiliki jaringan payudara.',
    },
    {
      id: 3,
      question: 'Benjolan di payudara atau ketiak adalah gejala umum kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'fact',
      explanation: 'Benjolan yang tidak hilang adalah salah satu tanda utama kanker payudara dan harus segera diperiksa.',
    },
    {
      id: 4,
      question: 'Menggunakan bra berkawat dapat menyebabkan kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'myth',
      explanation: 'Tidak ada bukti ilmiah yang menunjukkan bahwa penggunaan bra berkawat menyebabkan kanker payudara.',
    },
    {
      id: 5,
      question: 'Riwayat keluarga dengan kanker payudara meningkatkan risiko Anda.',
      type: 'myth-fact',
      correctAnswer: 'fact',
      explanation: 'Memiliki anggota keluarga dengan kanker payudara meningkatkan risiko, terutama jika ada mutasi genetik BRCA1/BRCA2.',
    },
    {
      id: 6,
      question: 'Semua benjolan di payudara adalah kanker.',
      type: 'myth-fact',
      correctAnswer: 'myth',
      explanation: 'Banyak benjolan payudara bersifat jinak (non-kanker), namun tetap harus diperiksa oleh dokter.',
    },
    {
      id: 7,
      question: 'Deteksi dini melalui mammografi dapat menurunkan angka kematian akibat kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'fact',
      explanation: 'Skrining mammografi reguler membantu mendeteksi kanker payudara pada stadium awal sehingga meningkatkan peluang kesembuhan.',
    },
    {
      id: 8,
      question: 'Antiperspirant atau deodoran bisa menyebabkan kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'myth',
      explanation: 'Tidak ada bukti ilmiah yang menunjukkan hubungan antara penggunaan antiperspirant/deodoran dengan kanker payudara.',
    },
    {
      id: 9,
      question: 'Obesitas dapat meningkatkan risiko kanker payudara.',
      type: 'myth-fact',
      correctAnswer: 'fact',
      explanation: 'Kelebihan berat badan, terutama setelah menopause, meningkatkan produksi estrogen yang dapat meningkatkan risiko kanker payudara.',
    },
    {
      id: 10,
      question: 'SADARI (Pemeriksaan Payudara Sendiri) tidak penting jika tidak ada gejala.',
      type: 'myth-fact',
      correctAnswer: 'myth',
      explanation: 'SADARI sangat penting untuk deteksi dini. Pemeriksaan rutin membantu mengenali perubahan pada payudara sejak awal.',
    },
  ],
};

// Konten Edukasi Kanker Payudara
export const breastCancerEducation: EducationalContent[] = [
  {
    id: 'bc-edu-1',
    testId: 'breast-cancer',
    title: 'Apa Itu Kanker Payudara?',
    type: 'article',
    content: `
      <h2>Apa Itu Kanker Payudara?</h2>
      <p>Kanker payudara terjadi saat sel di jaringan payudara tumbuh tidak terkendali. Ini adalah jenis kanker paling umum pada wanita, tetapi juga dapat terjadi pada pria (meskipun jarang).</p>
      
      <h3>Faktor Risiko Umum</h3>
      <ul>
        <li><strong>Usia >40 tahun</strong></li>
        <li><strong>Riwayat keluarga dengan kanker payudara</strong></li>
        <li><strong>Mutasi genetik (BRCA1/BRCA2)</strong></li>
        <li><strong>Menstruasi dini atau menopause terlambat</strong></li>
        <li><strong>Tidak pernah melahirkan atau melahirkan di usia >30 tahun</strong></li>
        <li><strong>Terapi hormon pascamenopause</strong></li>
        <li><strong>Konsumsi alkohol</strong></li>
      </ul>

      <h3>Gejala Umum</h3>
      <ul>
        <li>Benjolan di payudara atau ketiak</li>
        <li>Perubahan ukuran atau bentuk payudara</li>
        <li>Keluar cairan dari puting (bukan ASI)</li>
        <li>Perubahan kulit payudara (kemerahan, bengkak)</li>
        <li>Puting tertarik ke dalam</li>
      </ul>
    `,
  },
  {
    id: 'bc-edu-2',
    testId: 'breast-cancer',
    title: 'Tutorial SADARI (Pemeriksaan Payudara Sendiri)',
    type: 'video',
    content: `
      <h2>Cara Melakukan SADARI</h2>
      <p>Pelajari cara melakukan pemeriksaan payudara sendiri (SADARI) dengan benar melalui video tutorial ini.</p>
      <p>SADARI sebaiknya dilakukan sebulan sekali, 7-10 hari setelah menstruasi.</p>
    `,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/sadari-thumbnail.jpg',
    duration: '5:30',
  },
  {
    id: 'bc-edu-3',
    testId: 'breast-cancer',
    title: 'Pencegahan Kanker Payudara',
    type: 'article',
    content: `
      <h2>Langkah-Langkah Pencegahan</h2>
      <p>Meskipun tidak semua kasus kanker payudara dapat dicegah, ada beberapa langkah yang dapat mengurangi risiko:</p>
      
      <h3>Gaya Hidup Sehat</h3>
      <ul>
        <li><strong>Olahraga teratur</strong> - Minimal 150 menit per minggu</li>
        <li><strong>Jaga berat badan ideal</strong> - Hindari obesitas</li>
        <li><strong>Batasi konsumsi alkohol</strong></li>
        <li><strong>Konsumsi makanan sehat</strong> - Perbanyak sayur dan buah</li>
        <li><strong>Hindari merokok</strong></li>
      </ul>

      <h3>Deteksi Dini</h3>
      <ul>
        <li><strong>SADARI rutin</strong> - Setiap bulan</li>
        <li><strong>Pemeriksaan klinis</strong> - Setahun sekali</li>
        <li><strong>Mammografi</strong> - Sesuai rekomendasi dokter (biasanya mulai usia 40 tahun)</li>
      </ul>

      <h3>Konsultasi Genetik</h3>
      <p>Jika memiliki riwayat keluarga kuat, pertimbangkan konsultasi genetik untuk tes BRCA1/BRCA2.</p>
    `,
  },
];

// Daftar semua tes yang tersedia
export const availableTests: RiskTest[] = [breastCancerTest];

// Fungsi helper untuk mendapatkan tes berdasarkan ID
export const getTestById = (testId: string): RiskTest | undefined => {
  return availableTests.find((test) => test.id === testId);
};

// Fungsi helper untuk mendapatkan quiz berdasarkan test ID
export const getQuizByTestId = (testId: string): Quiz | undefined => {
  if (testId === 'breast-cancer') return breastCancerQuiz;
  return undefined;
};

// Fungsi helper untuk mendapatkan konten edukasi berdasarkan test ID
export const getEducationByTestId = (testId: string): EducationalContent[] => {
  return breastCancerEducation.filter((content) => content.testId === testId);
};
