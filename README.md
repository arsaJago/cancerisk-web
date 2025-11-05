# Cancerisk Web

Aplikasi web edukasi dan tes risiko kanker menggunakan Next.js.

## Fitur Utama

- 🔍 Tes Risiko Kanker (sistem skor)
- 📚 Halaman Edukasi (artikel & video)
- 📝 Kuis Pemahaman (Mitos/Fakta)
- 👨‍💼 Dashboard Admin
- 📊 Visualisasi Hasil

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts (untuk visualisasi data)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Proyek

```
cancerisk-web/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   ├── components/       # Komponen React reusable
│   ├── types/           # TypeScript types
│   └── lib/             # Utility functions & data
├── public/              # Static assets
└── ...config files
```

## Alur Pengguna

1. Pilih jenis tes kanker
2. Isi kuesioner risiko
3. Lihat hasil skor risiko
4. Belajar dari artikel/video
5. Ambil kuis pemahaman
6. Lihat hasil kuis

## Admin Panel

Akses di `/admin` untuk melihat hasil respon responden.
