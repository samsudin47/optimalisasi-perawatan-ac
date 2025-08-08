# 📋 Sistem Optimalisasi Jadwal Perawatan AC

## 🎯 Gambaran Umum Sistem

Sistem ini menggunakan **K-means Clustering** untuk mengoptimalkan jadwal perawatan AC berdasarkan:

-   **Lama Pemakaian** (dalam bulan)
-   **Frekuensi Kerusakan** (jumlah kerusakan)

## 🔧 Cara Kerja Sistem

### 1. **Proses Clustering**

-   **Iterasi 1**: Centroid awal C1(3,2) dan C2(14,2)
-   **Iterasi 2**: Centroid dihitung ulang berdasarkan hasil iterasi 1
-   **Iterasi 3**: Centroid final untuk pengelompokan akhir

### 2. **Hasil Clustering**

Sistem menghasilkan **2 cluster utama**:

#### 🟢 **Cluster 1 - Prioritas Rendah/Sedang**

-   **Karakteristik**: AC dengan kondisi stabil
-   **Interval Perawatan**: 3-6 bulan
-   **Jenis Perawatan**: Rutin & Pembersihan

#### 🔴 **Cluster 2 - Prioritas Tinggi**

-   **Karakteristik**: AC dengan frekuensi kerusakan tinggi
-   **Interval Perawatan**: 1-2 bulan
-   **Jenis Perawatan**: Intensif & Monitoring

## 📊 Tabel Jadwal Perawatan

Sistem menghasilkan tabel komprehensif dengan informasi:

| Field                   | Deskripsi                      |
| ----------------------- | ------------------------------ |
| **AC Code**             | Kode unik setiap AC            |
| **Nama AC**             | Nama/lokasi AC                 |
| **Cluster**             | Cluster 1 atau 2               |
| **Lama Pemakaian**      | Dalam bulan                    |
| **Frekuensi Kerusakan** | Jumlah kerusakan               |
| **Prioritas**           | Tinggi/Sedang/Rendah           |
| **Jadwal Terdekat**     | Tanggal perawatan berikutnya   |
| **Jenis Perawatan**     | Tipe perawatan yang diperlukan |

## 🎯 Kesimpulan & Rekomendasi

### **Manfaat Utama**

1. **📈 Efisiensi Biaya**: Perawatan berdasarkan kebutuhan, bukan jadwal umum
2. **⚡ Pencegahan Kerusakan**: Identifikasi AC berisiko tinggi lebih awal
3. **🎯 Prioritas Jelas**: Fokus sumber daya pada AC yang paling membutuhkan

### **Strategi Manajemen Kedepan**

#### 🔄 **1. Monitoring Berkelanjutan**

-   Update data lama pemakaian setiap bulan
-   Catat setiap kerusakan yang terjadi
-   Monitor efektivitas jadwal perawatan

#### 📊 **2. Re-clustering Berkala**

-   Jalankan ulang clustering setiap **6 bulan**
-   Penyesuaian berdasarkan data terbaru
-   Evaluasi perubahan karakteristik AC

#### 📋 **3. Dokumentasi Perawatan**

-   Catat detail setiap aktivitas perawatan
-   Analisis efektivitas perawatan
-   Prediksi kerusakan berdasarkan pola

#### 🔍 **4. Analisis Lanjutan**

-   Identifikasi AC yang perlu diganti
-   Analisis cost-benefit perawatan vs penggantian
-   Optimalisasi inventory spare part

## 🏆 **Rekomendasi Implementasi**

### **Jangka Pendek (1-3 bulan)**

-   [ ] Terapkan jadwal perawatan hasil clustering
-   [ ] Monitor performa AC cluster prioritas tinggi
-   [ ] Dokumentasi semua aktivitas perawatan

### **Jangka Menengah (3-6 bulan)**

-   [ ] Evaluasi efektivitas jadwal baru
-   [ ] Re-clustering dengan data terbaru
-   [ ] Analisis penghematan biaya

### **Jangka Panjang (6-12 bulan)**

-   [ ] Implementasi predictive maintenance
-   [ ] Integrasi IoT untuk monitoring real-time
-   [ ] Pengembangan dashboard analytics

## 📈 **Indikator Keberhasilan**

1. **Penurunan Downtime AC**: Target 30-50%
2. **Efisiensi Biaya Perawatan**: Target 20-40%
3. **Peningkatan Lifetime AC**: Target 15-25%
4. **Kepuasan Pengguna**: Minimal 85%

## 🛠️ **Tools & Teknologi**

-   **Backend**: Laravel PHP
-   **Frontend**: React.js + Inertia.js
-   **Algorithm**: K-means Clustering
-   **Database**: MySQL/SQLite
-   **Styling**: Tailwind CSS

---

_Sistem ini dirancang untuk memberikan solusi komprehensif dalam optimalisasi jadwal perawatan AC, membantu organisasi mencapai efisiensi operasional yang optimal._
