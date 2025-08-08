<?php

namespace App\Http\Controllers;

use App\Models\CentroidProsesModel;
use App\Models\SecondIterationModel;
use App\Models\ThirdIterationModel;
use App\Models\DataUnitAcModel;
use App\Models\MasterAcModel;
use App\Models\MasterStatusAcModel;
use Inertia\Inertia;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Statistik dasar
            $totalAC = MasterAcModel::count();
            $totalDataUnit = DataUnitAcModel::count();
            $totalStatus = MasterStatusAcModel::count();

            // Status clustering
            $clusteringStatus = [
                'first_iteration' => CentroidProsesModel::count(),
                'second_iteration' => SecondIterationModel::count(),
                'third_iteration' => ThirdIterationModel::count(),
            ];

            // Ambil data hasil clustering terbaru untuk analisis
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

            // Analisis cluster
            $clusterAnalysis = [
                'total_clustered' => $finalIteration->count(),
                'cluster_1_count' => $finalIteration->where('summary_cluster', 1)->count(),
                'cluster_2_count' => $finalIteration->where('summary_cluster', 2)->count(),
                'clustering_completed' => $finalIteration->isNotEmpty()
            ];

            // Analisis prioritas AC (jika clustering sudah dilakukan)
            $priorityAnalysis = [
                'high_priority' => 0,
                'medium_priority' => 0,
                'low_priority' => 0
            ];

            if ($finalIteration->isNotEmpty()) {
                foreach ($finalIteration as $item) {
                    if (isset($item->data_unit_ac)) {
                        $lamaPemakaian = $item->data_unit_ac->cluster_first_id ?? 0;
                        $frekuensiKerusakan = $item->data_unit_ac->cluster_second_id ?? 0;
                        
                        $prioritas = $this->determinePriority($lamaPemakaian, $frekuensiKerusakan);
                        
                        switch ($prioritas) {
                            case 'Tinggi':
                                $priorityAnalysis['high_priority']++;
                                break;
                            case 'Sedang':
                                $priorityAnalysis['medium_priority']++;
                                break;
                            case 'Rendah':
                                $priorityAnalysis['low_priority']++;
                                break;
                        }
                    }
                }
            }

            // Data service terbaru
            $recentServices = DataUnitAcModel::with(['ac', 'status'])
                ->orderBy('date_service', 'desc')
                ->limit(5)
                ->get();

            // Statistik bulanan
            $monthlyStats = DataUnitAcModel::selectRaw('
                MONTH(date_service) as bulan,
                YEAR(date_service) as tahun,
                COUNT(*) as total_service
            ')
            ->whereYear('date_service', Carbon::now()->year)
            ->groupBy('bulan', 'tahun')
            ->orderBy('bulan')
            ->get();

            return Inertia::render('Dashboard', [
                'stats' => [
                    'total_ac' => $totalAC,
                    'total_data_unit' => $totalDataUnit,
                    'total_status' => $totalStatus,
                ],
                'clustering_status' => $clusteringStatus,
                'cluster_analysis' => $clusterAnalysis,
                'priority_analysis' => $priorityAnalysis,
                'recent_services' => $recentServices,
                'monthly_stats' => $monthlyStats,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error')
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error in DashboardController: ' . $e->getMessage());
            
            return Inertia::render('Dashboard', [
                'stats' => [
                    'total_ac' => 0,
                    'total_data_unit' => 0,
                    'total_status' => 0,
                ],
                'clustering_status' => [
                    'first_iteration' => 0,
                    'second_iteration' => 0,
                    'third_iteration' => 0,
                ],
                'cluster_analysis' => [
                    'total_clustered' => 0,
                    'cluster_1_count' => 0,
                    'cluster_2_count' => 0,
                    'clustering_completed' => false
                ],
                'priority_analysis' => [
                    'high_priority' => 0,
                    'medium_priority' => 0,
                    'low_priority' => 0
                ],
                'recent_services' => [],
                'monthly_stats' => [],
                'flash' => [
                    'error' => 'Terjadi kesalahan saat memuat dashboard'
                ]
            ]);
        }
    }

    private function determinePriority($avgLamaPemakaian, $avgFrekuensiKerusakan)
    {
        if ($avgLamaPemakaian > 10 && $avgFrekuensiKerusakan > 3) {
            return 'Tinggi';
        }
        elseif ($avgLamaPemakaian > 8 || $avgFrekuensiKerusakan > 2) {
            return 'Sedang';
        }
        else {
            return 'Rendah';
        }
    }
}
