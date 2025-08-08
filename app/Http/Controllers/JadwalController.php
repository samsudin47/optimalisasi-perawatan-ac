<?php

namespace App\Http\Controllers;

use App\Models\CentroidProsesModel;
use App\Models\SecondIterationModel;
use App\Models\ThirdIterationModel;
use App\Models\DataUnitAcModel;
use Inertia\Inertia;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Debug data tersedia
            $dataStatus = [
                'third_iteration' => ThirdIterationModel::count(),
                'second_iteration' => SecondIterationModel::count(),
                'first_iteration' => CentroidProsesModel::count(),
                'data_unit_ac' => DataUnitAcModel::count()
            ];

            // Jika tidak ada data clustering sama sekali, tampilkan pesan
            if ($dataStatus['first_iteration'] == 0) {
                return Inertia::render('Jadwal/Index', [
                    'cluster1' => [],
                    'cluster2' => [],
                    'cluster1Analysis' => [
                        'name' => 'Cluster 1',
                        'count' => 0,
                        'avg_lama_pemakaian' => 0,
                        'avg_frekuensi_kerusakan' => 0,
                        'prioritas' => 'Tidak ada data',
                        'interval_perawatan' => 0,
                        'karakteristik' => 'Data clustering belum tersedia'
                    ],
                    'cluster2Analysis' => [
                        'name' => 'Cluster 2',
                        'count' => 0,
                        'avg_lama_pemakaian' => 0,
                        'avg_frekuensi_kerusakan' => 0,
                        'prioritas' => 'Tidak ada data',
                        'interval_perawatan' => 0,
                        'karakteristik' => 'Data clustering belum tersedia'
                    ],
                    'jadwalPerawatan' => [],
                    'conclusion' => [
                        'summary' => 'Belum ada data clustering tersedia',
                        'cluster1_summary' => 'Cluster 1: 0 unit - Belum ada data',
                        'cluster2_summary' => 'Cluster 2: 0 unit - Belum ada data',
                        'recommendations' => [
                            'Silakan jalankan proses clustering terlebih dahulu di menu Clustering Data',
                            'Pastikan data AC sudah diinput sebelum menjalankan clustering'
                        ]
                    ],
                    'totalAC' => 0,
                    'dataStatus' => $dataStatus,
                    'flash' => [
                        'success' => session('success'),
                        'error' => session('error')
                    ]
                ]);
            }

            // Ambil data hasil clustering terbaru dengan join manual untuk memastikan data tersedia
            $finalIteration = collect();

            // Cek iterasi 3 terlebih dahulu
            $thirdIteration = ThirdIterationModel::all();
            if ($thirdIteration->isNotEmpty()) {
                $finalIteration = $thirdIteration->map(function($item) {
                    $dataUnit = DataUnitAcModel::with('ac')->find($item->code_ac_id);
                    if ($dataUnit) {
                        $item->data_unit_ac = $dataUnit;
                    }
                    return $item;
                })->filter(function($item) {
                    return isset($item->data_unit_ac);
                });
            }

            // Jika tidak ada data iterasi 3, gunakan iterasi 2
            if ($finalIteration->isEmpty()) {
                $secondIteration = SecondIterationModel::all();
                if ($secondIteration->isNotEmpty()) {
                    $finalIteration = $secondIteration->map(function($item) {
                        $dataUnit = DataUnitAcModel::with('ac')->find($item->code_ac_id);
                        if ($dataUnit) {
                            $item->data_unit_ac = $dataUnit;
                        }
                        return $item;
                    })->filter(function($item) {
                        return isset($item->data_unit_ac);
                    });
                }
            }

            // Jika masih kosong, gunakan iterasi 1
            if ($finalIteration->isEmpty()) {
                $firstIteration = CentroidProsesModel::all();
                if ($firstIteration->isNotEmpty()) {
                    $finalIteration = $firstIteration->map(function($item) {
                        $dataUnit = DataUnitAcModel::with('ac')->find($item->code_ac_id);
                        if ($dataUnit) {
                            $item->data_unit_ac = $dataUnit;
                        }
                        return $item;
                    })->filter(function($item) {
                        return isset($item->data_unit_ac);
                    });
                }
            }

            // Kelompokkan berdasarkan cluster
            $cluster1 = $finalIteration->where('summary_cluster', 1);
            $cluster2 = $finalIteration->where('summary_cluster', 2);

            // Hitung statistik
            $totalAC = $finalIteration->count();
            $cluster1Count = $cluster1->count();
            $cluster2Count = $cluster2->count();

            // Analisis karakteristik cluster
            $cluster1Analysis = $this->analyzeCluster($cluster1, 'Cluster 1');
            $cluster2Analysis = $this->analyzeCluster($cluster2, 'Cluster 2');

            // Generate jadwal perawatan
            $jadwalPerawatan = $this->generateMaintenanceSchedule($cluster1, $cluster2);

            // Kesimpulan dan rekomendasi
            $conclusion = $this->generateConclusion($cluster1Analysis, $cluster2Analysis, $totalAC);

            return Inertia::render('Jadwal/Index', [
                'cluster1' => $cluster1->values(),
                'cluster2' => $cluster2->values(),
                'cluster1Analysis' => $cluster1Analysis,
                'cluster2Analysis' => $cluster2Analysis,
                'jadwalPerawatan' => $jadwalPerawatan,
                'conclusion' => $conclusion,
                'totalAC' => $totalAC,
                'dataStatus' => $dataStatus,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error')
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error in JadwalController index: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data jadwal: ' . $e->getMessage());
        }
    }

    /**
     * Analisis karakteristik cluster
     */
    private function analyzeCluster($clusterData, $clusterName)
    {
        if ($clusterData->isEmpty()) {
            return [
                'name' => $clusterName,
                'count' => 0,
                'avg_lama_pemakaian' => 0,
                'avg_frekuensi_kerusakan' => 0,
                'min_lama_pemakaian' => 0,
                'max_lama_pemakaian' => 0,
                'min_frekuensi_kerusakan' => 0,
                'max_frekuensi_kerusakan' => 0,
                'prioritas' => 'Tidak ada data',
                'interval_perawatan' => 0,
                'karakteristik' => 'Tidak ada data'
            ];
        }

        // Ambil data lama pemakaian dan frekuensi kerusakan langsung dari data unit AC
        $lamaPemakaian = collect();
        $frekuensiKerusakan = collect();

        foreach ($clusterData as $item) {
            if (isset($item->data_unit_ac)) {
                $lamaPemakaian->push($item->data_unit_ac->cluster_first_id);
                $frekuensiKerusakan->push($item->data_unit_ac->cluster_second_id);
            }
        }

        if ($lamaPemakaian->isEmpty() || $frekuensiKerusakan->isEmpty()) {
            return [
                'name' => $clusterName,
                'count' => $clusterData->count(),
                'avg_lama_pemakaian' => 0,
                'avg_frekuensi_kerusakan' => 0,
                'min_lama_pemakaian' => 0,
                'max_lama_pemakaian' => 0,
                'min_frekuensi_kerusakan' => 0,
                'max_frekuensi_kerusakan' => 0,
                'prioritas' => 'Tidak ada data',
                'interval_perawatan' => 0,
                'karakteristik' => 'Tidak ada data'
            ];
        }

        $avgLamaPemakaian = $lamaPemakaian->avg();
        $avgFrekuensiKerusakan = $frekuensiKerusakan->avg();

        // Tentukan prioritas berdasarkan karakteristik
        $prioritas = $this->determinePriority($avgLamaPemakaian, $avgFrekuensiKerusakan);

        // Tentukan interval perawatan (dalam bulan)
        $intervalPerawatan = $this->determineMaintenanceInterval($avgLamaPemakaian, $avgFrekuensiKerusakan);

        // Karakteristik cluster
        $karakteristik = $this->getClusterCharacteristics($avgLamaPemakaian, $avgFrekuensiKerusakan);

        return [
            'name' => $clusterName,
            'count' => $clusterData->count(),
            'avg_lama_pemakaian' => round($avgLamaPemakaian, 2),
            'avg_frekuensi_kerusakan' => round($avgFrekuensiKerusakan, 2),
            'min_lama_pemakaian' => $lamaPemakaian->min(),
            'max_lama_pemakaian' => $lamaPemakaian->max(),
            'min_frekuensi_kerusakan' => $frekuensiKerusakan->min(),
            'max_frekuensi_kerusakan' => $frekuensiKerusakan->max(),
            'prioritas' => $prioritas,
            'interval_perawatan' => $intervalPerawatan,
            'karakteristik' => $karakteristik
        ];
    }

    /**
     * Tentukan prioritas perawatan
     */
    private function determinePriority($avgLamaPemakaian, $avgFrekuensiKerusakan)
    {
        // AC dengan lama pemakaian tinggi dan frekuensi kerusakan tinggi = Prioritas Tinggi
        if ($avgLamaPemakaian > 10 && $avgFrekuensiKerusakan > 3) {
            return 'Tinggi';
        }
        // AC dengan salah satu parameter tinggi = Prioritas Sedang
        elseif ($avgLamaPemakaian > 8 || $avgFrekuensiKerusakan > 2) {
            return 'Sedang';
        }
        // Lainnya = Prioritas Rendah
        else {
            return 'Rendah';
        }
    }

    /**
     * Tentukan interval perawatan dalam bulan
     */
    private function determineMaintenanceInterval($avgLamaPemakaian, $avgFrekuensiKerusakan)
    {
        // Prioritas Tinggi: Perawatan setiap 1-2 bulan
        if ($avgLamaPemakaian > 10 && $avgFrekuensiKerusakan > 3) {
            return 1;
        }
        // Prioritas Sedang: Perawatan setiap 3 bulan
        elseif ($avgLamaPemakaian > 8 || $avgFrekuensiKerusakan > 2) {
            return 3;
        }
        // Prioritas Rendah: Perawatan setiap 6 bulan
        else {
            return 6;
        }
    }

    /**
     * Dapatkan karakteristik cluster
     */
    private function getClusterCharacteristics($avgLamaPemakaian, $avgFrekuensiKerusakan)
    {
        if ($avgLamaPemakaian > 10 && $avgFrekuensiKerusakan > 3) {
            return 'AC Kritis - Memerlukan perhatian khusus dan perawatan intensif';
        }
        elseif ($avgLamaPemakaian > 8 && $avgFrekuensiKerusakan <= 2) {
            return 'AC Tua - Sudah lama digunakan tapi masih relatif stabil';
        }
        elseif ($avgLamaPemakaian <= 8 && $avgFrekuensiKerusakan > 2) {
            return 'AC Bermasalah - Relatif baru tapi sering rusak, perlu investigasi';
        }
        else {
            return 'AC Normal - Kondisi baik, perawatan rutin';
        }
    }

    /**
     * Generate jadwal perawatan
     */
    private function generateMaintenanceSchedule($cluster1, $cluster2)
    {
        $jadwal = [];
        $currentDate = Carbon::now();

        // Cluster 1
        foreach ($cluster1 as $ac) {
            if (!isset($ac->data_unit_ac)) {
                continue;
            }

            $interval = $this->determineMaintenanceInterval(
                $ac->data_unit_ac->cluster_first_id ?? 0,
                $ac->data_unit_ac->cluster_second_id ?? 0
            );

            $jadwal[] = [
                'ac_code' => $ac->data_unit_ac->ac->code_ac ?? 'N/A',
                'nama_ac' => $ac->data_unit_ac->ac->nama_ac ?? 'N/A',
                'cluster' => 'Cluster 1',
                'lama_pemakaian' => $ac->data_unit_ac->cluster_first_id ?? 0,
                'frekuensi_kerusakan' => $ac->data_unit_ac->cluster_second_id ?? 0,
                'prioritas' => $this->determinePriority(
                    $ac->data_unit_ac->cluster_first_id ?? 0,
                    $ac->data_unit_ac->cluster_second_id ?? 0
                ),
                'interval_bulan' => $interval,
                'jadwal_terdekat' => $currentDate->copy()->addMonths($interval)->format('d M Y'),
                'jadwal_selanjutnya' => $currentDate->copy()->addMonths($interval * 2)->format('d M Y'),
                'jenis_perawatan' => $this->getMaintenanceType($interval)
            ];
        }

        // Cluster 2
        foreach ($cluster2 as $ac) {
            if (!isset($ac->data_unit_ac)) {
                continue;
            }

            $interval = $this->determineMaintenanceInterval(
                $ac->data_unit_ac->cluster_first_id ?? 0,
                $ac->data_unit_ac->cluster_second_id ?? 0
            );

            $jadwal[] = [
                'ac_code' => $ac->data_unit_ac->ac->code_ac ?? 'N/A',
                'nama_ac' => $ac->data_unit_ac->ac->nama_ac ?? 'N/A',
                'cluster' => 'Cluster 2',
                'lama_pemakaian' => $ac->data_unit_ac->cluster_first_id ?? 0,
                'frekuensi_kerusakan' => $ac->data_unit_ac->cluster_second_id ?? 0,
                'prioritas' => $this->determinePriority(
                    $ac->data_unit_ac->cluster_first_id ?? 0,
                    $ac->data_unit_ac->cluster_second_id ?? 0
                ),
                'interval_bulan' => $interval,
                'jadwal_terdekat' => $currentDate->copy()->addMonths($interval)->format('d M Y'),
                'jadwal_selanjutnya' => $currentDate->copy()->addMonths($interval * 2)->format('d M Y'),
                'jenis_perawatan' => $this->getMaintenanceType($interval)
            ];
        }

        // Urutkan berdasarkan prioritas
        usort($jadwal, function($a, $b) {
            $prioritas = ['Tinggi' => 1, 'Sedang' => 2, 'Rendah' => 3];
            return $prioritas[$a['prioritas']] <=> $prioritas[$b['prioritas']];
        });

        return $jadwal;
    }

    /**
     * Tentukan jenis perawatan
     */
    private function getMaintenanceType($interval)
    {
        switch ($interval) {
            case 1:
                return 'Perawatan Intensif & Monitoring';
            case 3:
                return 'Perawatan Rutin & Pembersihan';
            case 6:
                return 'Pemeriksaan Berkala';
            default:
                return 'Perawatan Standar';
        }
    }

    /**
     * Generate kesimpulan dan rekomendasi
     */
    private function generateConclusion($cluster1Analysis, $cluster2Analysis, $totalAC)
    {
        $recommendations = [];

        // Analisis cluster dengan prioritas tinggi
        $highPriorityCluster = null;
        if ($cluster1Analysis['prioritas'] === 'Tinggi' || $cluster2Analysis['prioritas'] === 'Tinggi') {
            $highPriorityCluster = $cluster1Analysis['prioritas'] === 'Tinggi' ? $cluster1Analysis : $cluster2Analysis;
            $recommendations[] = "Segera lakukan perawatan intensif untuk {$highPriorityCluster['name']} yang memiliki {$highPriorityCluster['count']} unit AC.";
        }

        // Rekomendasi umum
        $recommendations[] = "Total {$totalAC} unit AC telah dikelompokkan berdasarkan karakteristik penggunaan dan kerusakan.";
        $recommendations[] = "Cluster 1: {$cluster1Analysis['count']} unit - {$cluster1Analysis['karakteristik']}";
        $recommendations[] = "Cluster 2: {$cluster2Analysis['count']} unit - {$cluster2Analysis['karakteristik']}";

        // Rekomendasi strategis
        if ($cluster1Analysis['avg_frekuensi_kerusakan'] > 3 || $cluster2Analysis['avg_frekuensi_kerusakan'] > 3) {
            $recommendations[] = "Pertimbangkan untuk mengganti AC yang sering rusak dengan unit yang lebih baru.";
        }

        $recommendations[] = "Lakukan monitoring rutin dan dokumentasi setiap perawatan untuk optimalisasi jadwal kedepannya.";

        return [
            'summary' => "Hasil clustering K-means mengidentifikasi 2 kelompok AC dengan karakteristik berbeda untuk optimalisasi jadwal perawatan.",
            'cluster1_summary' => "{$cluster1Analysis['name']}: {$cluster1Analysis['count']} unit, Prioritas {$cluster1Analysis['prioritas']}, Interval {$cluster1Analysis['interval_perawatan']} bulan",
            'cluster2_summary' => "{$cluster2Analysis['name']}: {$cluster2Analysis['count']} unit, Prioritas {$cluster2Analysis['prioritas']}, Interval {$cluster2Analysis['interval_perawatan']} bulan",
            'recommendations' => $recommendations
        ];
    }
}
