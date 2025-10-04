<?php

namespace App\Http\Controllers;

use App\Models\CentroidProsesModel;
use App\Models\SecondIterationModel;
use App\Models\ThirdIterationModel;
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
                        'features' => [$item->cluster_first_id, $item->cluster_second_id],
                        'lama_pemakaian' => $item->cluster_first_id,
                        'frekuensi_kerusakan' => $item->cluster_second_id
                    ];
                })->values();

            $k = 2;
            $maxIter = 100;
            $centroids = [];
            $iterations = [];
            $selisih_klaster = null;

            // Ambil data dari semua tabel iterasi
            $firstIteration = CentroidProsesModel::with(['data_unit_ac.ac'])->orderBy('created_at', 'asc')->paginate(10);
            $secondIteration = SecondIterationModel::with(['data_unit_ac.ac'])->orderBy('created_at', 'asc')->get();
            $thirdIteration = ThirdIterationModel::with(['data_unit_ac.ac'])->orderBy('created_at', 'asc')->get();

            return Inertia::render('ClusteringData/Index', [
                'centroidProcess' => $firstIteration,
                'secondIteration' => $secondIteration,
                'thirdIteration' => $thirdIteration,
                'centroids' => $centroids,
                'iterations' => $iterations,
                'selisih_klaster' => $selisih_klaster,
                'current_iteration' => session('current_iteration', 0),
                'iteration_status' => session('iteration_status', 'not_started'),
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error')
                ]
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

            $centroidProcess = CentroidProsesModel::with('data_unit_ac')->find($centroidProcessId);
            if (!$centroidProcess || !$centroidProcess->data_unit_ac) {
                return back()->with('error', 'Data centroid process tidak ditemukan');
            }

            // Ambil semua data untuk clustering
            $data = DataUnitAcModel::select('id', 'cluster_first_id', 'cluster_second_id')
                ->whereNotNull('cluster_first_id')
                ->whereNotNull('cluster_second_id')
                ->where('cluster_first_id', '>', 0)
                ->where('cluster_second_id', '>=', 0)
                ->get()
                ->map(function($item) {
                    return [$item->cluster_first_id, $item->cluster_second_id];
                })->toArray();

            $k = 2;
            $maxIter = 100;

            if (count($data) >= $k) {
                [$centroids, $iterations, $selisih_klaster] = $this->kMeansClustering($data, $k, $maxIter);

                if (count($centroids) >= 2) {
                    $cluster_first_id = $centroidProcess->data_unit_ac->cluster_first_id;
                    $cluster_second_id = $centroidProcess->data_unit_ac->cluster_second_id;

                    // Update semua field hasil clustering
                    $centroidProcess->cluster_first_id = $cluster_first_id;
                    $centroidProcess->cluster_second_id = $cluster_second_id;

                    // Hitung result_first_cluster
                    $centroidProcess->result_first_cluster = sqrt(
                        pow($cluster_first_id - $centroids[0][0], 2) +
                        pow($cluster_second_id - $centroids[0][1], 2)
                    );

                    // Hitung result_second_cluster
                    $centroidProcess->result_second_cluster = sqrt(
                        pow($cluster_first_id - $centroids[1][0], 2) +
                        pow($cluster_second_id - $centroids[1][1], 2)
                    );

                    // Hitung closest_distance
                    $centroidProcess->closest_distance = min(
                        $centroidProcess->result_first_cluster,
                        $centroidProcess->result_second_cluster
                    );

                    // Tentukan summary_cluster
                    if ($centroidProcess->result_first_cluster < $centroidProcess->result_second_cluster) {
                        $centroidProcess->summary_cluster = 1;
                    } else {
                        $centroidProcess->summary_cluster = 2;
                    }

                    $centroidProcess->save();

                    return back()->with('success', 'Berhasil menentukan cluster');
                }
            }

            return back()->with('error', 'Gagal melakukan uji klaster. Data tidak mencukupi atau tidak valid.');
        } catch (Exception $e) {
            Log::error('Error in ujiKlaster: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses data: ' . $e->getMessage());
        }
    }

    private function kMeansClustering($data, $k, $maxIter = 100)
    {
        $iterations = [];
        $centroids = [];
        $selisih_klaster = [];

        return [$centroids, $iterations, $selisih_klaster];
    }

    public function ujiSemua(Request $request)
    {
        try {
            // Jalankan iterasi 1
            $centroid1 = [3, 2];
            $centroid2 = [14, 2];

            session([
                'current_iteration' => 1,
                'centroids' => [$centroid1, $centroid2],
                'iteration_status' => 'completed'
            ]);

            $centroidProcesses = CentroidProsesModel::with('data_unit_ac')->get();
            foreach ($centroidProcesses as $process) {
                if ($process->data_unit_ac) {
                    $D = $process->data_unit_ac->cluster_first_id;
                    $E = $process->data_unit_ac->cluster_second_id;

                    $process->result_first_cluster = sqrt(
                        pow($D - $centroid1[0], 2) + pow($E - $centroid1[1], 2)
                    );

                    $process->result_second_cluster = sqrt(
                        pow($D - $centroid2[0], 2) + pow($E - $centroid2[1], 2)
                    );

                    $process->closest_distance = min(
                        $process->result_first_cluster,
                        $process->result_second_cluster
                    );

                    $process->summary_cluster = ($process->result_first_cluster < $process->result_second_cluster) ? 1 : 2;
                    $process->save();
                }
            }

            // Jalankan iterasi 2
            $cluster1Data = CentroidProsesModel::with('data_unit_ac')->where('summary_cluster', 1)->get();
            $cluster2Data = CentroidProsesModel::with('data_unit_ac')->where('summary_cluster', 2)->get();

            $totalX1 = $cluster1Data->sum(function($item) { return $item->data_unit_ac->cluster_first_id; });
            $totalY1 = $cluster1Data->sum(function($item) { return $item->data_unit_ac->cluster_second_id; });
            $count1 = $cluster1Data->count();
            $centroid1 = $count1 > 0 ? [$totalX1 / $count1, $totalY1 / $count1] : [14, 2];

            $totalX2 = $cluster2Data->sum(function($item) { return $item->data_unit_ac->cluster_first_id; });
            $totalY2 = $cluster2Data->sum(function($item) { return $item->data_unit_ac->cluster_second_id; });
            $count2 = $cluster2Data->count();
            $centroid2 = $count2 > 0 ? [$totalX2 / $count2, $totalY2 / $count2] : [3, 2];

            session([
                'current_iteration' => 2,
                'centroids' => [$centroid1, $centroid2],
                'iteration_status' => 'completed'
            ]);

            SecondIterationModel::truncate();
            $allData = DataUnitAcModel::whereNotNull('cluster_first_id')->whereNotNull('cluster_second_id')->get();

            foreach ($allData as $data) {
                $D = $data->cluster_first_id;
                $E = $data->cluster_second_id;

                $result_first_cluster = sqrt(pow($D - $centroid1[0], 2) + pow($E - $centroid1[1], 2));
                $result_second_cluster = sqrt(pow($D - $centroid2[0], 2) + pow($E - $centroid2[1], 2));
                $closest_distance = min($result_first_cluster, $result_second_cluster);
                $summary_cluster = ($result_first_cluster < $result_second_cluster) ? 1 : 2;

                SecondIterationModel::create([
                    'code_ac_id' => $data->id,
                    'cluster_first_id' => $data->cluster_first_id,
                    'cluster_second_id' => $data->cluster_second_id,
                    'result_first_cluster' => $result_first_cluster,
                    'result_second_cluster' => $result_second_cluster,
                    'closest_distance' => $closest_distance,
                    'summary_cluster' => $summary_cluster,
                ]);
            }

            // Jalankan iterasi 3
            $cluster1Data = SecondIterationModel::with('data_unit_ac')->where('summary_cluster', 1)->get();
            $cluster2Data = SecondIterationModel::with('data_unit_ac')->where('summary_cluster', 2)->get();

            $totalX1 = $cluster1Data->sum(function($item) { return $item->data_unit_ac->cluster_first_id; });
            $totalY1 = $cluster1Data->sum(function($item) { return $item->data_unit_ac->cluster_second_id; });
            $count1 = $cluster1Data->count();
            $centroid1 = $count1 > 0 ? [$totalX1 / $count1, $totalY1 / $count1] : [14, 2];

            $totalX2 = $cluster2Data->sum(function($item) { return $item->data_unit_ac->cluster_first_id; });
            $totalY2 = $cluster2Data->sum(function($item) { return $item->data_unit_ac->cluster_second_id; });
            $count2 = $cluster2Data->count();
            $centroid2 = $count2 > 0 ? [$totalX2 / $count2, $totalY2 / $count2] : [3, 2];

            session([
                'current_iteration' => 3,
                'centroids' => [$centroid1, $centroid2],
                'iteration_status' => 'completed'
            ]);

            ThirdIterationModel::truncate();

            foreach ($allData as $data) {
                $D = $data->cluster_first_id;
                $E = $data->cluster_second_id;

                $result_first_cluster = sqrt(pow($D - $centroid1[0], 2) + pow($E - $centroid1[1], 2));
                $result_second_cluster = sqrt(pow($D - $centroid2[0], 2) + pow($E - $centroid2[1], 2));
                $closest_distance = min($result_first_cluster, $result_second_cluster);
                $summary_cluster = ($result_first_cluster < $result_second_cluster) ? 1 : 2;

                ThirdIterationModel::create([
                    'code_ac_id' => $data->id,
                    'cluster_first_id' => $data->cluster_first_id,
                    'cluster_second_id' => $data->cluster_second_id,
                    'result_first_cluster' => $result_first_cluster,
                    'result_second_cluster' => $result_second_cluster,
                    'closest_distance' => $closest_distance,
                    'summary_cluster' => $summary_cluster,
                ]);
            }

            return back()->with('success', 'Semua iterasi berhasil diselesaikan! Iterasi 1, 2, dan 3 telah selesai diproses.');
        } catch (Exception $e) {
            Log::error('Error in ujiSemua: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses semua iterasi: ' . $e->getMessage());
        }
    }

    /**
     * Iterasi 1 - Set centroid awal dan proses clustering
     */
    public function ujiIterasi1(Request $request)
    {
        try {
            // Centroid awal tetap (sesuai Excel)
            $centroid1 = [3, 2]; // C1: Lama Pemakaian = 3, Frekuensi = 2
            $centroid2 = [14, 2];  // C2: Lama Pemakaian = 14, Frekuensi = 2
            // Simpan centroid ke session untuk iterasi selanjutnya
            session([
                'current_iteration' => 1,
                'centroids' => [$centroid1, $centroid2],
                'iteration_status' => 'completed'
            ]);// Update semua data centroid process dengan perhitungan iterasi 1
            $centroidProcesses = CentroidProsesModel::with('data_unit_ac')->get();
            foreach ($centroidProcesses as $process) {
                if ($process->data_unit_ac) {
                    $D = $process->data_unit_ac->cluster_first_id;  // Lama Pemakaian
                    $E = $process->data_unit_ac->cluster_second_id; // Frekuensi Kerusakan
                    // result_first_cluster = SQRT((D-J6)^2+(E-K6)^2) dimana J6=14, K6=2
                    $process->result_first_cluster = sqrt(
                        pow($D - $centroid1[0], 2) + pow($E - $centroid1[1], 2)
                    );
                    // result_second_cluster = SQRT((D-J8)^2+(E-K8)^2) dimana J8=3, K8=2
                    $process->result_second_cluster = sqrt(
                        pow($D - $centroid2[0], 2) + pow($E - $centroid2[1], 2)
                    );
                    // closest_distance = MIN(F6:G6)
                    $process->closest_distance = min(
                        $process->result_first_cluster,
                        $process->result_second_cluster
                    );
                    // summary_cluster = IF(F6<G6,"klaster 1","klaster 2")
                    if ($process->result_first_cluster < $process->result_second_cluster) {
                        $process->summary_cluster = 1; // klaster 1
                    } else {
                        $process->summary_cluster = 2; // klaster 2
                    }
                    $process->save();
                }
            }

            return back()->with('success', 'Iterasi 1 berhasil diselesaikan!');
        } catch (Exception $e) {
            Log::error('Error in ujiIterasi1: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses iterasi 1: ' . $e->getMessage());
        }
    }

    /**
     * Iterasi 2 - Hitung centroid baru berdasarkan hasil iterasi 1
     */
    public function ujiIterasi2(Request $request)
    {
        try {
            // Ambil data dari iterasi sebelumnya
            $currentIteration = session('current_iteration', 0);
            if ($currentIteration < 1) {
                return back()->with('error', 'Harap lakukan Iterasi 1 terlebih dahulu');
            }

            // Hitung centroid baru berdasarkan cluster dari iterasi 1
            $cluster1Data = CentroidProsesModel::with('data_unit_ac')
                ->where('summary_cluster', 1)->get();
            $cluster2Data = CentroidProsesModel::with('data_unit_ac')
                ->where('summary_cluster', 2)->get();

            // Hitung centroid baru untuk cluster 1
            $totalX1 = $cluster1Data->sum(function($item) {
                return $item->data_unit_ac->cluster_first_id;
            });
            $totalY1 = $cluster1Data->sum(function($item) {
                return $item->data_unit_ac->cluster_second_id;
            });
            $count1 = $cluster1Data->count();
            $centroid1 = $count1 > 0 ? [$totalX1 / $count1, $totalY1 / $count1] : [14, 2];

            // Hitung centroid baru untuk cluster 2
            $totalX2 = $cluster2Data->sum(function($item) {
                return $item->data_unit_ac->cluster_first_id;
            });
            $totalY2 = $cluster2Data->sum(function($item) {
                return $item->data_unit_ac->cluster_second_id;
            });
            $count2 = $cluster2Data->count();
            $centroid2 = $count2 > 0 ? [$totalX2 / $count2, $totalY2 / $count2] : [3, 2];

            // Simpan ke session
            session([
                'current_iteration' => 2,
                'centroids' => [$centroid1, $centroid2],
                'iteration_status' => 'completed'
            ]);

            // Hapus data lama di tabel kedua
            SecondIterationModel::truncate();

            // Simpan semua data ke tabel kedua dengan centroid baru
            $allData = DataUnitAcModel::whereNotNull('cluster_first_id')
                ->whereNotNull('cluster_second_id')->get();

            foreach ($allData as $data) {
                $D = $data->cluster_first_id;
                $E = $data->cluster_second_id;

                $result_first_cluster = sqrt(
                    pow($D - $centroid1[0], 2) + pow($E - $centroid1[1], 2)
                );

                $result_second_cluster = sqrt(
                    pow($D - $centroid2[0], 2) + pow($E - $centroid2[1], 2)
                );

                $closest_distance = min($result_first_cluster, $result_second_cluster);

                $summary_cluster = ($result_first_cluster < $result_second_cluster) ? 1 : 2;

                SecondIterationModel::create([
                    'code_ac_id' => $data->id,
                    'cluster_first_id' => $data->cluster_first_id,
                    'cluster_second_id' => $data->cluster_second_id,
                    'result_first_cluster' => $result_first_cluster,
                    'result_second_cluster' => $result_second_cluster,
                    'closest_distance' => $closest_distance,
                    'summary_cluster' => $summary_cluster,
                ]);
            }

            return back()->with('success', 'Iterasi 2 berhasil diselesaikan!');
        } catch (Exception $e) {
            Log::error('Error in ujiIterasi2: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses iterasi 2: ' . $e->getMessage());
        }
    }

    /**
     * Iterasi 3 - Hitung centroid final berdasarkan hasil iterasi 2
     */
    public function ujiIterasi3(Request $request)
    {
        try {
            // Ambil data dari iterasi sebelumnya
            $currentIteration = session('current_iteration', 0);
            if ($currentIteration < 2) {
                return back()->with('error', 'Harap lakukan Iterasi 2 terlebih dahulu');
            }

            // Hitung centroid baru berdasarkan cluster dari iterasi 2
            $cluster1Data = SecondIterationModel::with('data_unit_ac')
                ->where('summary_cluster', 1)->get();
            $cluster2Data = SecondIterationModel::with('data_unit_ac')
                ->where('summary_cluster', 2)->get();

            // Hitung centroid final untuk cluster 1
            $totalX1 = $cluster1Data->sum(function($item) {
                return $item->data_unit_ac->cluster_first_id;
            });
            $totalY1 = $cluster1Data->sum(function($item) {
                return $item->data_unit_ac->cluster_second_id;
            });
            $count1 = $cluster1Data->count();
            $centroid1 = $count1 > 0 ? [$totalX1 / $count1, $totalY1 / $count1] : [14, 2];

            // Hitung centroid final untuk cluster 2
            $totalX2 = $cluster2Data->sum(function($item) {
                return $item->data_unit_ac->cluster_first_id;
            });
            $totalY2 = $cluster2Data->sum(function($item) {
                return $item->data_unit_ac->cluster_second_id;
            });
            $count2 = $cluster2Data->count();
            $centroid2 = $count2 > 0 ? [$totalX2 / $count2, $totalY2 / $count2] : [3, 2];

            // Simpan ke session
            session([
                'current_iteration' => 3,
                'centroids' => [$centroid1, $centroid2],
                'iteration_status' => 'completed'
            ]);

            // Hapus data lama di tabel ketiga
            ThirdIterationModel::truncate();

            // Simpan semua data ke tabel ketiga dengan centroid final
            $allData = DataUnitAcModel::whereNotNull('cluster_first_id')
                ->whereNotNull('cluster_second_id')->get();

            foreach ($allData as $data) {
                $D = $data->cluster_first_id;
                $E = $data->cluster_second_id;

                $result_first_cluster = sqrt(
                    pow($D - $centroid1[0], 2) + pow($E - $centroid1[1], 2)
                );

                $result_second_cluster = sqrt(
                    pow($D - $centroid2[0], 2) + pow($E - $centroid2[1], 2)
                );

                $closest_distance = min($result_first_cluster, $result_second_cluster);

                $summary_cluster = ($result_first_cluster < $result_second_cluster) ? 1 : 2;

                ThirdIterationModel::create([
                    'code_ac_id' => $data->id,
                    'cluster_first_id' => $data->cluster_first_id,
                    'cluster_second_id' => $data->cluster_second_id,
                    'result_first_cluster' => $result_first_cluster,
                    'result_second_cluster' => $result_second_cluster,
                    'closest_distance' => $closest_distance,
                    'summary_cluster' => $summary_cluster,
                ]);
            }

            return back()->with('success', 'Iterasi 3 berhasil diselesaikan! Clustering selesai.');
        } catch (Exception $e) {
            Log::error('Error in ujiIterasi3: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat memproses iterasi 3: ' . $e->getMessage());
        }
    }

    /**
     * Reset semua iterasi
     */
    public function resetIterasi(Request $request)
    {
        try {
            // Reset session
            session()->forget(['current_iteration', 'centroids', 'iteration_status']);
            session([
                'current_iteration' => 0,
                'iteration_status' => 'not_started'
            ]);

            // Reset semua data di tabel pertama
            $centroidProcesses = CentroidProsesModel::all();
            foreach ($centroidProcesses as $process) {
                $process->result_first_cluster = null;
                $process->result_second_cluster = null;
                $process->closest_distance = null;
                $process->summary_cluster = null;
                $process->save();
            }

            // Hapus semua data di tabel kedua dan ketiga
            SecondIterationModel::truncate();
            ThirdIterationModel::truncate();

            return back()->with('success', 'Semua iterasi berhasil direset!');
        } catch (Exception $e) {
            Log::error('Error in resetIterasi: ' . $e->getMessage());
            return back()->with('error', 'Terjadi error saat reset iterasi: ' . $e->getMessage());
        }
    }
}
