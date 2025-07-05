<?php

namespace App\Http\Controllers;

use App\Models\CentroidProsesModel;
use Inertia\Inertia;
use App\Models\DataUnitAcModel;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class CentroidProsesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Ambil data numerik untuk clustering
            $data = DataUnitAcModel::select('id', 'cluster_first_id', 'cluster_second_id')
                ->whereNotNull('cluster_first_id')
                ->whereNotNull('cluster_second_id')
                ->where('cluster_first_id', '>', 0)
                ->where('cluster_second_id', '>=', 0)
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id,
                        'features' => [
                            (float) $item->cluster_first_id,
                            (float) $item->cluster_second_id
                        ]
                    ];
                })->values();

            $k = 2;
            $maxIter = 100;
            $centroids = [];
            $iterations = [];
            $selisih_klaster = null;

            if ($data->count() >= $k) {
                [$centroids, $iterations, $selisih_klaster] = $this->kMeansClustering($data->pluck('features')->toArray(), $k, $maxIter);
            }

            $query = CentroidProsesModel::with(['data_unit_ac.ac']);

            // Filter bulan dan tahun jika ada
            if ($request->filled('bulan')) {
                $query->whereHas('data_unit_ac', function($q) use ($request) {
                    $q->whereMonth('date_service', $request->bulan);
                });
            }
            if ($request->filled('tahun')) {
                $query->whereHas('data_unit_ac', function($q) use ($request) {
                    $q->whereYear('date_service', $request->tahun);
                });
            }

            // Ambil data centroid process dengan pagination
            $centroidProcess = CentroidProsesModel::with(['data_unit_ac.ac'])->paginate(10);

            // Proses hasil cluster untuk setiap data pada tabel
            $centroidProcess->getCollection()->transform(function ($item) use ($centroids) {
                if ($item->data_unit_ac) {
                    $features = [
                        (float) ($item->data_unit_ac->cluster_first_id ?? 0),
                        (float) ($item->data_unit_ac->cluster_second_id ?? 0)
                    ];

                    if (count($centroids) >= 2 && $features[0] > 0 && $features[1] >= 0) {
                        $distances = array_map(function($centroid) use ($features) {
                            return $this->euclideanDistance($features, $centroid);
                        }, $centroids);

                        $minDistance = min($distances);
                        $minIdx = array_search($minDistance, $distances);

                        // Jika belum ada hasil di database, hitung sementara untuk ditampilkan
                        if (is_null($item->result_first_cluster) || is_null($item->result_second_cluster)) {
                            $item->result_first_cluster = number_format($centroids[$minIdx][0], 4);
                            $item->result_second_cluster = number_format($centroids[$minIdx][1], 4);
                            $item->closest_distance = number_format($minDistance, 4);
                            $item->summary_cluster = $minIdx + 1;
                        }
                    }
                }

                return $item;
            });

            return Inertia::render('ClusteringData/Index', [
                'centroidProcess' => $centroidProcess,
                'centroids' => $centroids,
                'iterations' => $iterations,
                'selisih_klaster' => $selisih_klaster,
                'list_bulan' => $this->getListBulan(),
                'list_tahun' => $this->getListTahun(),
                'filter' => $request->only(['bulan', 'tahun']),
            ]);
        } catch (Exception $e) {
            Log::error('Error in index: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data');
        }
    }

    /**
     * Uji klaster untuk item tertentu
     */
    public function ujiKlaster(Request $request)
    {
        try {
            $centroidProcessId = $request->input('centroid_process_id');

            if (!$centroidProcessId) {
                return back()->with('error', 'ID centroid process tidak ditemukan');
            }

            // Validasi centroid process exists
            $centroidProcess = CentroidProsesModel::with('data_unit_ac')->find($centroidProcessId);
            if (!$centroidProcess || !$centroidProcess->data_unit_ac) {
                return back()->with('error', 'Data centroid process tidak ditemukan');
            }

            // Ambil data untuk clustering
            $data = DataUnitAcModel::select('id', 'cluster_first_id', 'cluster_second_id')
                ->whereNotNull('cluster_first_id')
                ->whereNotNull('cluster_second_id')
                ->where('cluster_first_id', '>', 0)
                ->where('cluster_second_id', '>=', 0)
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id,
                        'features' => [
                            (float) $item->cluster_first_id,
                            (float) $item->cluster_second_id
                        ]
                    ];
                })->values();

            $k = 2;
            $maxIter = 100;

            if ($data->count() >= $k) {
                [$centroids, $iterations, $selisih_klaster] = $this->kMeansClustering($data->pluck('features')->toArray(), $k, $maxIter);

                if (count($centroids) >= 2) {
                    $features = [
                        (float) ($centroidProcess->data_unit_ac->cluster_first_id ?? 0),
                        (float) ($centroidProcess->data_unit_ac->cluster_second_id ?? 0)
                    ];

                    if ($features[0] > 0 && $features[1] >= 0) {
                        $distances = array_map(function($centroid) use ($features) {
                            return $this->euclideanDistance($features, $centroid);
                        }, $centroids);

                        $minDistance = min($distances);
                        $minIdx = array_search($minDistance, $distances);

                        // Update data di database
                        $centroidProcess->update([
                            'result_first_cluster' => number_format($centroids[$minIdx][0], 4),
                            'result_second_cluster' => number_format($centroids[$minIdx][1], 4),
                            'closest_distance' => number_format($minDistance, 4),
                            'summary_cluster' => $minIdx + 1,
                        ]);

                        return back()->with('success', 'Uji klaster berhasil! Data telah diperbarui.');
                    }
                }
            }

            return back()->with('error', 'Gagal melakukan uji klaster. Data tidak mencukupi atau tidak valid.');
        } catch (Exception $e) {
            Log::error('Error in ujiKlaster: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses data: ' . $e->getMessage());
        }
    }

    /**
     * Proses semua data clustering
     */
    public function ujiSemua(Request $request)
    {
        try {
            // Ambil data untuk clustering
            $data = DataUnitAcModel::select('id', 'cluster_first_id', 'cluster_second_id')
                ->whereNotNull('cluster_first_id')
                ->whereNotNull('cluster_second_id')
                ->where('cluster_first_id', '>', 0)
                ->where('cluster_second_id', '>=', 0)
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id,
                        'features' => [
                            (float) $item->cluster_first_id,
                            (float) $item->cluster_second_id
                        ]
                    ];
                })->values();

            $k = 2;
            $maxIter = 100;

            if ($data->count() >= $k) {
                [$centroids, $iterations, $selisih_klaster] = $this->kMeansClustering($data->pluck('features')->toArray(), $k, $maxIter);

                if (count($centroids) >= 2) {
                    // Update semua data centroid process
                    $centroidProcesses = CentroidProsesModel::with('data_unit_ac')->get();
                    $updatedCount = 0;

                    foreach ($centroidProcesses as $centroidProcess) {
                        if ($centroidProcess->data_unit_ac) {
                            $features = [
                                (float) ($centroidProcess->data_unit_ac->cluster_first_id ?? 0),
                                (float) ($centroidProcess->data_unit_ac->cluster_second_id ?? 0)
                            ];

                            if ($features[0] > 0 && $features[1] >= 0) {
                                $distances = array_map(function($centroid) use ($features) {
                                    return $this->euclideanDistance($features, $centroid);
                                }, $centroids);

                                $minDistance = min($distances);
                                $minIdx = array_search($minDistance, $distances);

                                // Update data di database
                                $centroidProcess->update([
                                    'result_first_cluster' => number_format($centroids[$minIdx][0], 4),
                                    'result_second_cluster' => number_format($centroids[$minIdx][1], 4),
                                    'closest_distance' => number_format($minDistance, 4),
                                    'summary_cluster' => $minIdx + 1,
                                ]);

                                $updatedCount++;
                            }
                        }
                    }

                    return back()->with('success', "Berhasil memproses {$updatedCount} data clustering!");
                }
            }

            return back()->with('error', 'Gagal melakukan clustering. Data tidak mencukupi.');
        } catch (Exception $e) {
            Log::error('Error in ujiSemua: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses semua data: ' . $e->getMessage());
        }
    }

    /**
     * Helper methods untuk dropdown
     */
    private function getListBulan()
    {
        return [
            ['value' => 1, 'label' => 'Januari'],
            ['value' => 2, 'label' => 'Februari'],
            ['value' => 3, 'label' => 'Maret'],
            ['value' => 4, 'label' => 'April'],
            ['value' => 5, 'label' => 'Mei'],
            ['value' => 6, 'label' => 'Juni'],
            ['value' => 7, 'label' => 'Juli'],
            ['value' => 8, 'label' => 'Agustus'],
            ['value' => 9, 'label' => 'September'],
            ['value' => 10, 'label' => 'Oktober'],
            ['value' => 11, 'label' => 'November'],
            ['value' => 12, 'label' => 'Desember'],
        ];
    }

    private function getListTahun()
    {
        $currentYear = date('Y');
        $years = [];
        for ($i = $currentYear - 5; $i <= $currentYear + 2; $i++) {
            $years[] = ['value' => $i, 'label' => $i];
        }
        return $years;
    }

    /**
     * K-Means Clustering yang diperbaiki
     */
    private function kMeansClustering($data, $k = 2, $maxIter = 100)
    {
        // Validasi input
        if (empty($data) || count($data) < $k) {
            return [[], [], null];
        }

        // Validasi bahwa setiap data point memiliki 2 fitur
        foreach ($data as $point) {
            if (!is_array($point) || count($point) != 2) {
                return [[], [], null];
            }
        }

        try {
            // Inisialisasi centroid dengan K-Means++
            $centroids = $this->initializeCentroidsKMeansPlusPlus($data, $k);

            $iterations = [];
            $epsilon = 0.0001; // toleransi konvergensi

            for ($iter = 0; $iter < $maxIter; $iter++) {
                $previousCentroids = $centroids;

                // Assign points to clusters
                $clusters = array_fill(0, $k, []);
                $assignments = [];

                foreach ($data as $idx => $point) {
                    $distances = [];

                    foreach ($centroids as $centroid) {
                        $distance = $this->euclideanDistance($point, $centroid);
                        $distances[] = $distance;
                    }

                    $minDistance = min($distances);
                    $minIdx = array_search($minDistance, $distances);

                    $clusters[$minIdx][] = $point;
                    $assignments[$idx] = $minIdx;
                }

                // Update centroids
                $newCentroids = [];
                $allClustersHaveData = true;

                for ($i = 0; $i < $k; $i++) {
                    if (count($clusters[$i]) > 0) {
                        // Hitung mean dari cluster
                        $sumX = array_sum(array_column($clusters[$i], 0));
                        $sumY = array_sum(array_column($clusters[$i], 1));
                        $count = count($clusters[$i]);

                        $newCentroids[] = [
                            $sumX / $count,
                            $sumY / $count
                        ];
                    } else {
                        // Jika cluster kosong, reinitialize centroid
                        $newCentroids[] = $data[array_rand($data)];
                        $allClustersHaveData = false;
                    }
                }

                // Simpan iterasi
                $iterations[] = [
                    'iteration' => $iter + 1,
                    'centroids' => $newCentroids,
                    'clusters' => $clusters,
                    'assignments' => $assignments
                ];

                // Cek konvergensi
                $converged = true;
                if ($allClustersHaveData) {
                    for ($i = 0; $i < $k; $i++) {
                        $distance = $this->euclideanDistance($centroids[$i], $newCentroids[$i]);
                        if ($distance > $epsilon) {
                            $converged = false;
                            break;
                        }
                    }
                } else {
                    $converged = false;
                }

                $centroids = $newCentroids;

                // Jika konvergen, hentikan iterasi
                if ($converged && $iter > 0) {
                    break;
                }
            }

            // Hitung jarak antar centroid
            $selisih_klaster = null;
            if (count($centroids) >= 2) {
                $selisih_klaster = $this->euclideanDistance($centroids[0], $centroids[1]);
            }

            return [$centroids, $iterations, $selisih_klaster];

        } catch (Exception $e) {
            Log::error('K-Means Clustering Error: ' . $e->getMessage());
            return [[], [], null];
        }
    }

    /**
     * Inisialisasi centroid menggunakan K-Means++
     */
    private function initializeCentroidsKMeansPlusPlus($data, $k)
    {
        $centroids = [];
        $n = count($data);

        if ($n == 0) {
            return $centroids;
        }

        // Pilih centroid pertama secara random
        $firstIndex = array_rand($data);
        $centroids[] = $data[$firstIndex];

        // Pilih centroid selanjutnya berdasarkan jarak terjauh
        for ($c = 1; $c < $k; $c++) {
            $distances = [];
            $totalDistance = 0;

            foreach ($data as $point) {
                $minDistance = PHP_FLOAT_MAX;

                foreach ($centroids as $centroid) {
                    $distance = $this->euclideanDistance($point, $centroid);
                    $minDistance = min($minDistance, $distance);
                }

                $squaredDistance = pow($minDistance, 2);
                $distances[] = $squaredDistance;
                $totalDistance += $squaredDistance;
            }

            if ($totalDistance == 0) {
                // Jika semua jarak 0, pilih random
                $centroids[] = $data[array_rand($data)];
            } else {
                // Pilih point dengan probabilitas proporsional dengan jarak kuadrat
                $rand = mt_rand() / mt_getrandmax() * $totalDistance;
                $cumulative = 0;

                for ($i = 0; $i < $n; $i++) {
                    $cumulative += $distances[$i];
                    if ($rand <= $cumulative) {
                        $centroids[] = $data[$i];
                        break;
                    }
                }
            }
        }

        return $centroids;
    }

    /**
     * Hitung jarak Euclidean antara dua point
     */
    private function euclideanDistance($point1, $point2)
    {
        if (!is_array($point1) || !is_array($point2) || count($point1) != count($point2)) {
            return 0;
        }

        $sum = 0;
        for ($i = 0; $i < count($point1); $i++) {
            $sum += pow($point1[$i] - $point2[$i], 2);
        }

        return sqrt($sum);
    }
}
