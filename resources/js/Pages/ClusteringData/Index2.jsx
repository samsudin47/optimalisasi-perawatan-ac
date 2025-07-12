import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import ClusteringKMeansPage from "@/Pages/ClusteringData/FirstIteration";

export default function ClusteringIndex({
    centroidProcess = null,
    centroids = [],
    iterations = [],
    selisih_klaster = null,
    summary = {},
    rekomendasi = "",
    list_bulan = [],
    list_tahun = [],
    filter = {},
    flash = {},
}) {
    const [isProcessing, setIsProcessing] = useState(null);
    const [filterData, setFilterData] = useState({
        bulan: filter.bulan || "",
        tahun: filter.tahun || "",
    });

    const { post, processing, reset } = useForm();

    const handleUjiKlaster = async (centroidProcessId) => {
        setIsProcessing(centroidProcessId);

        try {
            post(
                route("clustering-data.uji"),
                {
                    centroid_process_id: centroidProcessId,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsProcessing(null);
                        reset();
                    },
                    onError: (errors) => {
                        console.error("Error during uji klaster:", errors);
                        setIsProcessing(null);
                        reset();
                    },
                    onFinish: () => {
                        setIsProcessing(null);
                        reset();
                    },
                }
            );
        } catch (error) {
            console.error("Error in handleUjiKlaster:", error);
            setIsProcessing(null);
            reset();
        }
    };

    const handleProcessAll = async () => {
        setIsProcessing("all");

        try {
            post(
                route("clustering-data.uji-semua"),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsProcessing(null);
                        reset();
                    },
                    onError: (errors) => {
                        console.error("Error during process all:", errors);
                        setIsProcessing(null);
                        reset();
                    },
                    onFinish: () => {
                        setIsProcessing(null);
                        reset();
                    },
                }
            );
        } catch (error) {
            console.error("Error in handleProcessAll:", error);
            setIsProcessing(null);
            reset();
        }
    };

    const handleFilterChange = (key, value) => {
        setFilterData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFilterSubmit = () => {
        router.get(
            route("clustering-data.index"),
            {
                bulan: filterData.bulan,
                tahun: filterData.tahun,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleFilterReset = () => {
        setFilterData({ bulan: "", tahun: "" });
        router.get(
            route("clustering-data.index"),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    // Reset processing state when component unmounts or flash messages change
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setIsProcessing(null);
        }
    }, [flash]);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            console.log("Success:", flash.success);
        }
        if (flash?.error) {
            console.log("Error:", flash.error);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Clustering Data
                </h2>
            }
        >
            <Head title="Clustering Data" />

            <div className="py-12">
                <div className="mx-auto max-w-[1600px] sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div
                            className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {flash.success}
                            </span>
                        </div>
                    )}
                    {flash?.error && (
                        <div
                            className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {flash.error}
                            </span>
                        </div>
                    )}

                    {/* Filter Section */}
                    {(list_bulan.length > 0 || list_tahun.length > 0) && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-semibold mb-4">
                                    Filter Data
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {list_bulan.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bulan
                                            </label>
                                            <select
                                                value={filterData.bulan}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "bulan",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">
                                                    Semua Bulan
                                                </option>
                                                {list_bulan.map((bulan) => (
                                                    <option
                                                        key={bulan.value}
                                                        value={bulan.value}
                                                    >
                                                        {bulan.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {list_tahun.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tahun
                                            </label>
                                            <select
                                                value={filterData.tahun}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "tahun",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">
                                                    Semua Tahun
                                                </option>
                                                {list_tahun.map((tahun) => (
                                                    <option
                                                        key={tahun.value}
                                                        value={tahun.value}
                                                    >
                                                        {tahun.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex items-end space-x-2">
                                        <button
                                            onClick={handleFilterSubmit}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Filter
                                        </button>
                                        <button
                                            onClick={handleFilterReset}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- SISIPKAN TAB DI SINI --- */}
                    <ClusteringKMeansPage
                        iterations={iterations}
                        centroids={centroids}
                        selisih_klaster={selisih_klaster}
                        summary={summary}
                        rekomendasi={rekomendasi}
                        flash={flash}
                    />

                    {/* Main Data Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h3 className="text-lg font-semibold">
                                    Data Clustering K-Means
                                </h3>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="text-sm text-gray-500">
                                        Total data:{" "}
                                        {centroidProcess?.data?.length || 0}
                                    </div>
                                    <button
                                        onClick={handleProcessAll}
                                        disabled={
                                            isProcessing === "all" ||
                                            processing ||
                                            isProcessing !== null ||
                                            !centroidProcess?.data?.length
                                        }
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            isProcessing === "all" ||
                                            processing ||
                                            isProcessing !== null ||
                                            !centroidProcess?.data?.length
                                                ? "bg-gray-400 cursor-not-allowed text-white"
                                                : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                                        }`}
                                    >
                                        {isProcessing === "all" ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Memproses Semua...
                                            </>
                                        ) : (
                                            "Proses Semua Data"
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                    <thead className="bg-blue-600">
                                        <tr>
                                            <th className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider">
                                                Code AC
                                            </th>
                                            <th className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider">
                                                Terakhir Service
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                Lama Pemakaian
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                Frekuensi Kerusakan
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                C1
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                C2
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                Jarak Terdekat
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                Klaster
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {centroidProcess?.data?.length > 0 ? (
                                            centroidProcess.data.map(
                                                (centroidProcessed) => (
                                                    <tr
                                                        key={
                                                            centroidProcessed.id
                                                        }
                                                        className="hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                            {centroidProcessed
                                                                .data_unit_ac
                                                                ?.ac?.code_ac ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                            {centroidProcessed
                                                                .data_unit_ac
                                                                ?.date_service ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                            {centroidProcessed
                                                                .data_unit_ac
                                                                ?.cluster_first_id ||
                                                                "-"}{" "}
                                                            bulan
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                            {centroidProcessed
                                                                .data_unit_ac
                                                                ?.cluster_second_id ||
                                                                "-"}{" "}
                                                            kali
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                            {centroidProcessed.result_first_cluster ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                            {centroidProcessed.result_second_cluster ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                            {centroidProcessed.closest_distance ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                    centroidProcessed.summary_cluster ===
                                                                    1
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : centroidProcessed.summary_cluster ===
                                                                          2
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {centroidProcessed.summary_cluster
                                                                    ? `Cluster ${centroidProcessed.summary_cluster}`
                                                                    : "Belum diuji"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() =>
                                                                    handleUjiKlaster(
                                                                        centroidProcessed.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isProcessing ===
                                                                        centroidProcessed.id ||
                                                                    isProcessing ===
                                                                        "all" ||
                                                                    processing
                                                                }
                                                                className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold tracking-widest text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                                    isProcessing ===
                                                                        centroidProcessed.id ||
                                                                    isProcessing ===
                                                                        "all" ||
                                                                    processing
                                                                        ? "bg-gray-400 cursor-not-allowed"
                                                                        : "bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700"
                                                                }`}
                                                            >
                                                                {isProcessing ===
                                                                centroidProcessed.id ? (
                                                                    <>
                                                                        <svg
                                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <circle
                                                                                className="opacity-25"
                                                                                cx="12"
                                                                                cy="12"
                                                                                r="10"
                                                                                stroke="currentColor"
                                                                                strokeWidth="4"
                                                                            ></circle>
                                                                            <path
                                                                                className="opacity-75"
                                                                                fill="currentColor"
                                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                            ></path>
                                                                        </svg>
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    "Uji Klaster"
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-6 py-8 text-center text-gray-500"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <svg
                                                            className="w-12 h-12 text-gray-400 mb-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2a2 2 0 00-2 2v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a2 2 0 00-2-2H4"
                                                            ></path>
                                                        </svg>
                                                        <p className="text-lg font-medium">
                                                            Tidak ada data untuk
                                                            ditampilkan
                                                        </p>
                                                        <p className="text-sm">
                                                            Data akan muncul
                                                            setelah ada proses
                                                            clustering
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {centroidProcess?.links && (
                                <div className="mt-4">
                                    <Pagination links={centroidProcess.links} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hasil K-Means */}
                    {(centroids.length > 0 ||
                        iterations.length > 0 ||
                        selisih_klaster !== null) && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-8">
                            <div className="p-6 text-gray-900">
                                <h3 className="font-bold text-xl mb-6 text-gray-800 border-b pb-2">
                                    Hasil Analisis K-Means Clustering
                                </h3>

                                {/* Centroids */}
                                {centroids.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-lg mb-3 text-blue-700">
                                            Centroids Akhir
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {centroids.map((centroid, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                                                >
                                                    <div className="font-medium text-blue-800 mb-2">
                                                        Cluster {idx + 1}
                                                    </div>
                                                    <div className="text-sm space-y-1">
                                                        <div className="flex justify-between">
                                                            <span>
                                                                Lama Pemakaian:
                                                            </span>
                                                            <span className="font-semibold">
                                                                {centroid[0]?.toFixed(
                                                                    4
                                                                )}{" "}
                                                                bulan
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>
                                                                Frekuensi
                                                                Kerusakan:
                                                            </span>
                                                            <span className="font-semibold">
                                                                {centroid[1]?.toFixed(
                                                                    4
                                                                )}{" "}
                                                                kali
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Iterasi */}
                                {iterations.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-lg mb-3 text-green-700">
                                            Proses Iterasi ({iterations.length}{" "}
                                            iterasi)
                                        </h4>
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {iterations
                                                .slice(0, 5)
                                                .map((iteration, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-green-50 p-4 rounded-lg border border-green-200"
                                                    >
                                                        <div className="font-medium text-green-800 mb-2">
                                                            Iterasi{" "}
                                                            {iteration.iteration ||
                                                                idx + 1}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {iteration.centroids?.map(
                                                                (
                                                                    centroid,
                                                                    centroidIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            centroidIdx
                                                                        }
                                                                        className="text-sm"
                                                                    >
                                                                        <div className="font-medium mb-1">
                                                                            Centroid{" "}
                                                                            {centroidIdx +
                                                                                1}
                                                                            :
                                                                        </div>
                                                                        <div className="text-gray-600">
                                                                            (
                                                                            {centroid[0]?.toFixed(
                                                                                4
                                                                            )}
                                                                            ,{" "}
                                                                            {centroid[1]?.toFixed(
                                                                                4
                                                                            )}
                                                                            )
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            {iterations.length > 5 && (
                                                <div className="text-center text-gray-500 text-sm">
                                                    ... dan{" "}
                                                    {iterations.length - 5}{" "}
                                                    iterasi lainnya
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Selisih Klaster */}
                                {selisih_klaster !== null && (
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <h4 className="font-semibold text-lg mb-2 text-red-700">
                                            Jarak Antar Centroid
                                        </h4>
                                        <div className="text-sm text-red-600">
                                            Jarak Euclidean antar centroid:{" "}
                                            <span className="font-semibold text-lg">
                                                {Number(
                                                    selisih_klaster
                                                ).toFixed(4)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
