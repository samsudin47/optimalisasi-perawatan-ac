import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function JadwalIndex({
    cluster1 = [],
    cluster2 = [],
    cluster1Analysis = {},
    cluster2Analysis = {},
    jadwalPerawatan = [],
    conclusion = {},
    totalAC = 0,
    dataStatus = {},
    flash = {},
}) {
    const [selectedTab, setSelectedTab] = useState(0);

    // Debug: log data yang diterima
    console.log("Jadwal Component Data:", {
        cluster1: cluster1.length,
        cluster2: cluster2.length,
        jadwalPerawatan: jadwalPerawatan.length,
        totalAC,
        dataStatus,
        cluster1Analysis,
        cluster2Analysis,
    });

    // Format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Warna prioritas
    const getPriorityColor = (prioritas) => {
        switch (prioritas) {
            case "Tinggi":
                return "bg-red-100 text-red-800 border-red-200";
            case "Sedang":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Rendah":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    // Warna cluster
    const getClusterColor = (cluster) => {
        return cluster === "Cluster 1"
            ? "bg-blue-100 text-blue-800"
            : "bg-purple-100 text-purple-800";
    };

    // Tab data
    const tabs = [
        { name: "Jadwal Perawatan", enabled: true },
        { name: "Analisis Cluster", enabled: true },
        { name: "Kesimpulan & Rekomendasi", enabled: true },
    ];

    // Render Jadwal Perawatan
    const renderJadwalPerawatan = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Jadwal Perawatan AC</h3>
                <p className="text-blue-100">
                    Berdasarkan hasil clustering K-means, berikut jadwal
                    perawatan untuk {totalAC} unit AC
                </p>
                {dataStatus && (
                    <div className="mt-4 text-sm text-blue-100">
                        <p>
                            Status Data: Iterasi 1:{" "}
                            {dataStatus.first_iteration || 0}, Iterasi 2:{" "}
                            {dataStatus.second_iteration || 0}, Iterasi 3:{" "}
                            {dataStatus.third_iteration || 0}
                        </p>
                    </div>
                )}
            </div>

            {/* Filter by Priority */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-3">Ringkasan Prioritas</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Tinggi", "Sedang", "Rendah"].map((prioritas) => {
                        const count = jadwalPerawatan.filter(
                            (item) => item.prioritas === prioritas
                        ).length;
                        return (
                            <div
                                key={prioritas}
                                className={`p-3 rounded-lg border ${getPriorityColor(
                                    prioritas
                                )}`}
                            >
                                <div className="text-lg font-bold">{count}</div>
                                <div className="text-sm">
                                    Prioritas {prioritas}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tabel Jadwal */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    AC Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cluster
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Karakteristik
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Prioritas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jadwal Terdekat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jenis Perawatan
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jadwalPerawatan && jadwalPerawatan.length > 0 ? (
                                jadwalPerawatan.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.ac_code || "N/A"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.nama_ac || "N/A"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClusterColor(
                                                    item.cluster
                                                )}`}
                                            >
                                                {item.cluster}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                Pemakaian:{" "}
                                                {item.lama_pemakaian || 0} bulan
                                            </div>
                                            <div>
                                                Kerusakan:{" "}
                                                {item.frekuensi_kerusakan || 0}x
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                                                    item.prioritas
                                                )}`}
                                            >
                                                {item.prioritas}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-medium">
                                                {item.jadwal_terdekat}
                                            </div>
                                            <div className="text-gray-500">
                                                Interval:{" "}
                                                {item.interval_bulan || 0} bulan
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.jenis_perawatan}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        <div className="py-8">
                                            <div className="text-lg font-medium text-gray-900 mb-2">
                                                Tidak ada data jadwal perawatan
                                            </div>
                                            <div className="text-sm text-gray-500 mb-4">
                                                Silakan jalankan proses
                                                clustering terlebih dahulu di
                                                menu Clustering Data
                                            </div>
                                            <Link
                                                href="/clustering-data"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                Ke Halaman Clustering
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Render Analisis Cluster
    const renderAnalisisCluster = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Analisis Cluster</h3>
                <p className="text-green-100">
                    Karakteristik dan statistik dari setiap cluster hasil
                    K-means clustering
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cluster 1 Analysis */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <h4 className="text-lg font-semibold">
                            {cluster1Analysis.name}
                        </h4>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded">
                                <div className="text-2xl font-bold text-blue-600">
                                    {cluster1Analysis.count}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Jumlah AC
                                </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded">
                                <div className="text-2xl font-bold text-blue-600">
                                    {cluster1Analysis.interval_perawatan}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Bulan Interval
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h5 className="font-medium mb-2">Statistik</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Rata-rata Pemakaian:</span>
                                    <span className="font-medium">
                                        {cluster1Analysis.avg_lama_pemakaian}{" "}
                                        bulan
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rata-rata Kerusakan:</span>
                                    <span className="font-medium">
                                        {
                                            cluster1Analysis.avg_frekuensi_kerusakan
                                        }
                                        x
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Prioritas:</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                                            cluster1Analysis.prioritas
                                        )}`}
                                    >
                                        {cluster1Analysis.prioritas}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h5 className="font-medium mb-2">Karakteristik</h5>
                            <p className="text-sm text-gray-600">
                                {cluster1Analysis.karakteristik}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cluster 2 Analysis */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                        <h4 className="text-lg font-semibold">
                            {cluster2Analysis.name}
                        </h4>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-3 rounded">
                                <div className="text-2xl font-bold text-purple-600">
                                    {cluster2Analysis.count}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Jumlah AC
                                </div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded">
                                <div className="text-2xl font-bold text-purple-600">
                                    {cluster2Analysis.interval_perawatan}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Bulan Interval
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h5 className="font-medium mb-2">Statistik</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Rata-rata Pemakaian:</span>
                                    <span className="font-medium">
                                        {cluster2Analysis.avg_lama_pemakaian}{" "}
                                        bulan
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rata-rata Kerusakan:</span>
                                    <span className="font-medium">
                                        {
                                            cluster2Analysis.avg_frekuensi_kerusakan
                                        }
                                        x
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Prioritas:</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                                            cluster2Analysis.prioritas
                                        )}`}
                                    >
                                        {cluster2Analysis.prioritas}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h5 className="font-medium mb-2">Karakteristik</h5>
                            <p className="text-sm text-gray-600">
                                {cluster2Analysis.karakteristik}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render Kesimpulan & Rekomendasi
    const renderKesimpulan = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">
                    Kesimpulan & Rekomendasi
                </h3>
                <p className="text-orange-100">
                    Hasil analisis dan strategi perawatan AC kedepannya
                </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold mb-4">
                    Ringkasan Hasil Clustering
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700">{conclusion.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-blue-700">Cluster 1</h5>
                        <p className="text-sm text-gray-600">
                            {conclusion.cluster1_summary}
                        </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h5 className="font-medium text-purple-700">
                            Cluster 2
                        </h5>
                        <p className="text-sm text-gray-600">
                            {conclusion.cluster2_summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* Rekomendasi */}
            <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold mb-4">
                    Rekomendasi Strategis
                </h4>
                <div className="space-y-3">
                    {conclusion.recommendations?.map(
                        (recommendation, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700">
                                    {recommendation}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Manajemen Kedepan */}
            <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold mb-4">
                    Strategi Manajemen Perawatan Kedepan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                            📊
                        </div>
                        <h5 className="font-medium mb-2">
                            Monitoring Berkelanjutan
                        </h5>
                        <p className="text-sm text-gray-600">
                            Lakukan monitoring rutin setiap bulan untuk update
                            data lama pemakaian dan frekuensi kerusakan.
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3">
                            🔄
                        </div>
                        <h5 className="font-medium mb-2">
                            Re-clustering Berkala
                        </h5>
                        <p className="text-sm text-gray-600">
                            Jalankan ulang clustering setiap 6 bulan untuk
                            penyesuaian jadwal berdasarkan data terbaru.
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-3">
                            📋
                        </div>
                        <h5 className="font-medium mb-2">
                            Dokumentasi Perawatan
                        </h5>
                        <p className="text-sm text-gray-600">
                            Catat setiap aktivitas perawatan untuk analisis
                            efektivitas dan prediksi kerusakan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Jadwal Perawatan AC
                </h2>
            }
        >
            <Head title="Jadwal Perawatan AC" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Alert Messages */}
                            {flash.success && (
                                <div className="mb-4 rounded-md bg-green-50 p-4">
                                    <div className="text-sm font-medium text-green-800">
                                        {flash.success}
                                    </div>
                                </div>
                            )}

                            {flash.error && (
                                <div className="mb-4 rounded-md bg-red-50 p-4">
                                    <div className="text-sm font-medium text-red-800">
                                        {flash.error}
                                    </div>
                                </div>
                            )}

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200 mb-6">
                                <nav
                                    className="-mb-px flex space-x-8"
                                    aria-label="Tabs"
                                >
                                    {tabs.map(
                                        (tab, index) =>
                                            tab.enabled && (
                                                <button
                                                    key={tab.name}
                                                    onClick={() =>
                                                        setSelectedTab(index)
                                                    }
                                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                        selectedTab === index
                                                            ? "border-indigo-500 text-indigo-600"
                                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                                >
                                                    {tab.name}
                                                </button>
                                            )
                                    )}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div>
                                {selectedTab === 0 && renderJadwalPerawatan()}
                                {selectedTab === 1 && renderAnalisisCluster()}
                                {selectedTab === 2 && renderKesimpulan()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
