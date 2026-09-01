# Ariyanto & Putri — Wedding Invitation

Website undangan pernikahan statis, mobile-first, ringan, dan siap di-host di Vercel, Netlify, atau GitHub Pages.

## 1. Fitur

- Opening invitation + nama tamu dari query `?to=`
- Hero full-screen
- Couple profile
- Quote/ayat
- Countdown menuju 20 Desember 2026 pukul 08.00 WIB
- Detail Akad & Resepsi
- Tombol Google Maps
- Love story timeline
- Gallery responsive + lightbox Vanilla JS
- RSVP + wishes dengan `localStorage`
- Wedding gift + copy rekening
- Music player tanpa library eksternal
- Smooth scrolling, active navigation, reveal animation, parallax ringan, back-to-top
- Responsive 320px sampai desktop

## 2. Struktur

```text
wedding-invitation/
├── index.html
├── README.md
├── .gitignore
└── assets/
    ├── css/style.css
    ├── js/script.js
    ├── images/
    │   ├── hero.jpg
    │   ├── groom.jpg
    │   ├── bride.jpg
    │   ├── gallery-1.jpg
    │   ├── gallery-2.jpg
    │   ├── gallery-3.jpg
    │   ├── gallery-4.jpg
    │   ├── gallery-5.jpg
    │   └── gallery-6.jpg
    └── audio/
        └── wedding-song.mp3
```

Folder `images` dan `audio` berisi placeholder kosong/harus diganti dengan asset milik Anda. Struktur website tetap dapat diuji tanpa asset tersebut; browser akan menampilkan fallback area dari styling.

## 3. Mengganti data undangan

Data utama berada paling atas `assets/js/script.js`:

```js
const weddingData = {
  groom: "Ariyanto",
  bride: "Putri",
  date: "20 Desember 2026",
  countdownDate: "2026-12-20T08:00:00+07:00",
  location: "Gedung Pernikahan",
  mapsUrl: "https://maps.google.com/"
};
```

Untuk mengubah:

- Nama: `groom` dan `bride`
- Tanggal/jam countdown: `countdownDate`
- Link lokasi: `mapsUrl`
- Nama/tanggal yang terlihat pada section event masih dapat diedit langsung di `index.html`
- Nama orang tua, alamat, rekening, dan jam event dapat dicari di `index.html` lalu diganti sesuai data final.

## 4. Nama tamu

Gunakan:

```text
index.html?to=Muhammad%20Rizki
```

Akan tampil `Muhammad Rizki`. Tanpa parameter `to`, tampil `Tamu Undangan`.

## 5. Foto

Letakkan foto milik Anda di folder `assets/images/` dengan nama file yang sesuai. Disarankan:

- JPG/WebP
- kompres sebelum upload
- hero sekitar 1600–2400 px lebar
- gallery sekitar 1200 px lebar sudah cukup untuk mayoritas perangkat

Pastikan Anda memiliki izin penggunaan foto.

## 6. Musik

Letakkan audio pada:

```text
assets/audio/wedding-song.mp3
```

Browser modern dapat memblokir autoplay sebelum interaksi. Template mencoba memulai musik ketika tombol `Buka Undangan` ditekan, lalu menyediakan tombol play/pause fixed sebagai kontrol manual.

Untuk publikasi, gunakan musik yang Anda punya hak/lisensinya. Lagu komersial seperti *Perfect*, *A Thousand Years*, *Until I Found You*, *Akad*, *Teman Hidup*, dan *Janji Suci* tidak otomatis bebas digunakan hanya karena dipasang di website. Pilihan yang lebih aman adalah musik instrumental original atau royalty-free sesuai lisensi penyedianya.

## 7. Menjalankan lokal

Cara paling sederhana: buka `index.html` pada browser.

Untuk hasil yang lebih konsisten, gunakan local server. Contoh jika Python tersedia:

```bash
python -m http.server 5500
```

Kemudian buka `http://localhost:5500`.

VS Code + Live Server juga dapat digunakan.

## 8. Deploy Vercel

1. Push folder ke GitHub/GitLab.
2. Masuk ke Vercel.
3. Import repository.
4. Framework Preset: `Other`.
5. Build Command dikosongkan.
6. Output Directory dikosongkan.
7. Deploy.

Website ini tidak membutuhkan build step.

## 9. Deploy Netlify

1. Push ke GitHub/GitLab, lalu pilih repository di Netlify; atau gunakan drag-and-drop folder project pada Netlify.
2. Karena website statis, tidak perlu build command.
3. Publish directory: root project.

## 10. Deploy GitHub Pages

1. Push seluruh project ke repository GitHub.
2. Buka Settings → Pages.
3. Pilih deploy from branch.
4. Pilih branch `main` dan folder `/root`.
5. Simpan dan tunggu GitHub Pages menerbitkan situs.

## 11. Catatan RSVP

RSVP/wishes memakai `localStorage`, sehingga data tersimpan hanya pada browser/perangkat yang digunakan. Ini belum menjadi sistem RSVP terpusat. Untuk undangan produksi, Anda dapat mengganti handler submit dengan API/backend, Google Apps Script, Supabase, Firebase, atau layanan form sesuai kebutuhan.

## 12. Lisensi & asset

Kode template ini dapat Anda modifikasi untuk project undangan. Gunakan foto, font, musik, ikon, dan materi visual sesuai lisensi masing-masing. Google Fonts di-load dari CDN dan menyediakan fallback font sistem jika CDN tidak tersedia.
# wedding-invitation
