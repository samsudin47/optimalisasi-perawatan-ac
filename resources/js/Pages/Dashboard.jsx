import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({
    stats = {},
    clustering_status = {},
    cluster_analysis = {},
    priority_analysis = {},
    recent_services = [],
    monthly_stats = [],
    flash = {},
}) {
    // Format angka
    const formatNumber = (num) => {
        return new Intl.NumberFormat("id-ID").format(num || 0);
    };

    // Format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Nama bulan
    const getMonthName = (monthNumber) => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agt",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ];
        return months[monthNumber - 1] || monthNumber;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Optimalisasi Jadwal Perawatan AC
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Flash Messages */}
                        {flash.success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {flash.error}
                            </div>
                        )}

                        {/* Statistik Utama */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total AC Terdaftar
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatNumber(
                                                        stats.total_ac
                                                    )}{" "}
                                                    Unit
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Data Service AC
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatNumber(
                                                        stats.total_data_unit
                                                    )}{" "}
                                                    Record
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    AC Ter-cluster
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {formatNumber(
                                                        cluster_analysis.total_clustered
                                                    )}{" "}
                                                    Unit
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Clustering */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Status Proses Clustering
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">
                                                    Iterasi 1
                                                </p>
                                                <p className="text-2xl font-bold text-blue-900">
                                                    {formatNumber(
                                                        clustering_status.first_iteration
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    clustering_status.first_iteration >
                                                    0
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-800">
                                                    Iterasi 2
                                                </p>
                                                <p className="text-2xl font-bold text-green-900">
                                                    {formatNumber(
                                                        clustering_status.second_iteration
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    clustering_status.second_iteration >
                                                    0
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-purple-800">
                                                    Iterasi 3
                                                </p>
                                                <p className="text-2xl font-bold text-purple-900">
                                                    {formatNumber(
                                                        clustering_status.third_iteration
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    clustering_status.third_iteration >
                                                    0
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analisis Cluster dan Prioritas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Distribusi Cluster */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Distribusi Cluster
                                    </h3>
                                    {cluster_analysis.clustering_completed ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                                                <span className="text-blue-800 font-medium">
                                                    Cluster 1
                                                </span>
                                                <span className="text-blue-900 font-bold">
                                                    {formatNumber(
                                                        cluster_analysis.cluster_1_count
                                                    )}{" "}
                                                    unit
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                                                <span className="text-purple-800 font-medium">
                                                    Cluster 2
                                                </span>
                                                <span className="text-purple-900 font-bold">
                                                    {formatNumber(
                                                        cluster_analysis.cluster_2_count
                                                    )}{" "}
                                                    unit
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">
                                                Clustering belum dilakukan
                                            </p>
                                            <Link
                                                href="/clustering-data"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                            >
                                                Mulai Clustering
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Analisis Prioritas */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Prioritas Perawatan
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                                            <span className="text-red-800 font-medium">
                                                Prioritas Tinggi
                                            </span>
                                            <span className="text-red-900 font-bold">
                                                {formatNumber(
                                                    priority_analysis.high_priority
                                                )}{" "}
                                                unit
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                                            <span className="text-yellow-800 font-medium">
                                                Prioritas Sedang
                                            </span>
                                            <span className="text-yellow-900 font-bold">
                                                {formatNumber(
                                                    priority_analysis.medium_priority
                                                )}{" "}
                                                unit
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                                            <span className="text-green-800 font-medium">
                                                Prioritas Rendah
                                            </span>
                                            <span className="text-green-900 font-bold">
                                                {formatNumber(
                                                    priority_analysis.low_priority
                                                )}{" "}
                                                unit
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Terbaru dan Navigasi Cepat */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Service Terbaru */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Service Terbaru
                                    </h3>
                                    {recent_services.length > 0 ? (
                                        <div className="space-y-3">
                                            {recent_services.map(
                                                (service, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {
                                                                    service.name_customer
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {service.ac
                                                                    ?.nama_ac ||
                                                                    "N/A"}{" "}
                                                                - {service.merk}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {formatDate(
                                                                    service.date_service
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {service.status
                                                                    ?.name_status ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            Belum ada data service
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Navigasi Cepat */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Navigasi Cepat
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/data-unit-ac"
                                            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Data AC
                                        </Link>
                                        <Link
                                            href="/clustering-data"
                                            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Clustering
                                        </Link>
                                        <Link
                                            href="/jadwal"
                                            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Jadwal
                                        </Link>
                                        <Link
                                            href="/master-ac"
                                            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Master AC
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistik Bulanan */}
                        {monthly_stats.length > 0 && (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Statistik Service Bulanan (
                                        {new Date().getFullYear()})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {monthly_stats.map((stat, index) => (
                                            <div
                                                key={index}
                                                className="text-center p-3 bg-gray-50 rounded"
                                            >
                                                <p className="text-sm font-medium text-gray-500">
                                                    {getMonthName(stat.bulan)}
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatNumber(
                                                        stat.total_service
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
