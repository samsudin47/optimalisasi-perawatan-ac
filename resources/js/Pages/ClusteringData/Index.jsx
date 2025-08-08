import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function ClusteringIndex({
    centroidProcess = null,
    centroids = [],
    iterations = [],
    selisih_klaster = null,
    filter = {},
    flash = {},
    current_iteration = 0,
    iteration_status = "not_started",
    secondIteration = [],
    thirdIteration = [],
}) {
    const [isProcessing, setIsProcessing] = useState(null);
    const [isProcessingAll, setIsProcessingAll] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const { post, delete: deleteMethod, processing, reset } = useForm();

    const handleUjiKlaster = async (centroidProcessId) => {
        setIsProcessing(centroidProcessId);
        try {
            post(
                route("clustering-data.uji"),
                { centroid_process_id: centroidProcessId },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsProcessing(null);
                        reset();
                    },
                    onError: (errors) => {
                        console.error("Error during clustering:", errors);
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

    const handleResetIterasi = () => {
        if (isProcessingAll) return;
        if (confirm("Apakah Anda yakin ingin menghapus semua iterasi?")) {
            setIsProcessingAll(true);

            // Safety timeout to ensure loading stops
            const timeoutId = setTimeout(() => {
                setIsProcessingAll(false);
            }, 10000); // 10 seconds timeout

            deleteMethod(route("clustering-data.reset"), {
                preserveScroll: true,
                onFinish: () => {
                    clearTimeout(timeoutId);
                    setIsProcessingAll(false);
                    alert("Berhasil! Semua iterasi telah direset.");
                },
            });
        }
    };
    const handleIterasiPertama = async () => {
        if (isProcessingAll) return;
        setIsProcessingAll(true);

        // Safety timeout to ensure loading stops
        const timeoutId = setTimeout(() => {
            setIsProcessingAll(false);
        }, 5000); // 10 seconds timeout

        post(
            route("clustering-data.uji-iterasi-1"),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    clearTimeout(timeoutId);
                    setIsProcessingAll(false);
                    alert("Berhasil! Iterasi 1 telah selesai diproses.");
                },
            }
        );
    };

    const handleIterasiKedua = async () => {
        if (isProcessingAll) return;
        setIsProcessingAll(true);

        // Safety timeout to ensure loading stops
        const timeoutId = setTimeout(() => {
            setIsProcessingAll(false);
        }, 5000); // 50 seconds timeout

        post(
            route("clustering-data.uji-iterasi-2"),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    clearTimeout(timeoutId);
                    setIsProcessingAll(false);
                    alert("Berhasil! Iterasi 2 telah selesai diproses.");
                },
            }
        );
    };

    const handleIterasiKetiga = async () => {
        if (isProcessingAll) return;
        setIsProcessingAll(true);

        // Safety timeout to ensure loading stops
        const timeoutId = setTimeout(() => {
            setIsProcessingAll(false);
        }, 5000); // 5 seconds timeout

        post(
            route("clustering-data.uji-iterasi-3"),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    clearTimeout(timeoutId);
                    setIsProcessingAll(false);
                    alert("Berhasil! Iterasi 3 telah selesai diproses.");
                },
            }
        );
    };

    const handleUjiSemua = async () => {
        if (isProcessingAll) return;
        setIsProcessingAll(true);

        // Safety timeout to ensure loading stops
        const timeoutId = setTimeout(() => {
            setIsProcessingAll(false);
        }, 5000); // 5 seconds timeout for all iterations

        post(
            route("clustering-data.uji-semua"),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    clearTimeout(timeoutId);
                    setIsProcessingAll(false);
                    alert("Berhasil! Semua iterasi telah selesai diproses.");
                },
            }
        );
    };

    // Function untuk format angka
    const formatNumber = (num) => {
        if (num === null || num === undefined) return "-";
        return typeof num === "number" ? num.toFixed(8) : num;
    };

    // Tab data untuk hasil clustering
    const tabs = [
        { name: "Hasil Clustering", enabled: true },
        { name: "Detail Iterasi", enabled: iterations?.length > 0 },
        { name: "Iterasi 2", enabled: secondIteration?.length > 0 },
        { name: "Iterasi 3", enabled: thirdIteration?.length > 0 },
        { name: "Jadwal Perawatan", enabled: centroids?.length > 0 },
    ];

    const renderClusterResults = () => (
        <div className="mt-4">
            <h4 className="text-lg font-medium mb-4">Hasil Akhir Clustering</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cluster
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Centroid X (Lama Pemakaian)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Centroid Y (Frekuensi Kerusakan)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {centroids?.map((centroid, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    Cluster {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatNumber(centroid?.[0])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatNumber(centroid?.[1])}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selisih_klaster !== null && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700">
                        <span className="font-medium">
                            Jarak antar cluster:
                        </span>{" "}
                        {formatNumber(selisih_klaster)}
                    </p>
                </div>
            )}
        </div>
    );

    const renderIterationDetails = () => (
        <div className="mt-4">
            <h4 className="text-lg font-medium mb-4">Detail Iterasi K-Means</h4>

            {iterations?.map((iteration, iterIndex) => (
                <div key={iterIndex} className="mb-8">
                    <h5 className="text-md font-semibold mb-4 text-indigo-600">
                        Iterasi {iteration.iteration}
                    </h5>

                    {/* Centroid Awal */}
                    {iteration.initial_centroids && (
                        <div className="mb-6">
                            <h6 className="text-sm font-medium mb-2 text-gray-700">
                                Centroid Awal:
                            </h6>
                            <div className="grid grid-cols-2 gap-4">
                                {iteration.initial_centroids.map(
                                    (centroid, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-50 p-3 rounded"
                                        >
                                            <p className="text-sm font-medium">
                                                C{idx + 1}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                ({formatNumber(centroid?.[0])},{" "}
                                                {formatNumber(centroid?.[1])})
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tabel Data Points dengan Perhitungan */}
                    {iteration.data_points && (
                        <div className="mb-6">
                            <h6 className="text-sm font-medium mb-2 text-gray-700">
                                Data Points dan Perhitungan Jarak:
                            </h6>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                    <thead className="bg-blue-600">
                                        <tr>
                                            {/* <th className="px-4 py-2 border-r text-xs font-medium text-gray-500 uppercase">
                                                ID
                                            </th> */}
                                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                Lama Pemakaian
                                            </th>
                                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                Frekuensi Kerusakan
                                            </th>
                                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                Jarak ke C1
                                            </th>
                                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                Jarak ke C2
                                            </th>
                                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                Jarak Terdekat
                                            </th>
                                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                Cluster
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {iteration.data_points.map(
                                            (point, pointIdx) => {
                                                const assignedCluster =
                                                    iteration.assignments?.[
                                                        pointIdx
                                                    ] || 0;
                                                const distanceC1 =
                                                    iteration.distances?.[
                                                        pointIdx
                                                    ]?.[0] || 0;
                                                const distanceC2 =
                                                    iteration.distances?.[
                                                        pointIdx
                                                    ]?.[1] || 0;
                                                const minDistance = Math.min(
                                                    distanceC1,
                                                    distanceC2
                                                );

                                                return (
                                                    <tr
                                                        key={pointIdx}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        {/* <td className="px-4 py-2 border-r text-sm text-gray-900">
                                                            {point.id}
                                                        </td> */}
                                                        <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                                            {
                                                                point.lama_pemakaian
                                                            }
                                                        </td>
                                                        <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                                            {
                                                                point.frekuensi_kerusakan
                                                            }
                                                        </td>
                                                        <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-blue-50">
                                                            {formatNumber(
                                                                distanceC1
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-green-50">
                                                            {formatNumber(
                                                                distanceC2
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-yellow-50">
                                                            {formatNumber(
                                                                minDistance
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 text-md text-center bg-purple-50">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-sm font-semibold rounded-md ${
                                                                    assignedCluster ===
                                                                    0
                                                                        ? "bg-green-200 text-green-800"
                                                                        : "bg-blue-200 text-blue-800"
                                                                }`}
                                                            >
                                                                Cluster{" "}
                                                                {assignedCluster +
                                                                    1}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Centroid Akhir */}
                    {iteration.final_centroids && (
                        <div className="mb-6">
                            <h6 className="text-sm font-medium mb-2 text-gray-700">
                                Centroid Akhir:
                            </h6>
                            <div className="grid grid-cols-2 gap-4">
                                {iteration.final_centroids.map(
                                    (centroid, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-green-50 p-3 rounded"
                                        >
                                            <p className="text-sm font-medium">
                                                C{idx + 1}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                ({formatNumber(centroid?.[0])},{" "}
                                                {formatNumber(centroid?.[1])})
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderSecondIteration = () => (
        <div className="mt-4">
            <h4 className="text-lg font-medium mb-4">
                Iterasi 2 - Hasil Perhitungan
            </h4>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-purple-600">
                        <tr>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Lama Pemakaian
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Frekuensi Kerusakan
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Jarak ke C1
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Jarak ke C2
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Jarak Terdekat
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Cluster
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {secondIteration?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                    {item.lama_pemakaian}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                    {item.frekuensi_kerusakan}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-blue-50">
                                    {formatNumber(item.jarak_c1)}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-green-50">
                                    {formatNumber(item.jarak_c2)}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-yellow-50">
                                    {formatNumber(item.jarak_terdekat)}
                                </td>
                                <td className="px-4 py-2 text-md text-center bg-purple-50">
                                    <span
                                        className={`inline-flex px-2 py-1 text-sm font-semibold rounded-md ${
                                            item.cluster === "C1"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-blue-200 text-blue-800"
                                        }`}
                                    >
                                        {item.cluster}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {secondIteration?.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">
                        Centroid Baru Iterasi 2:
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">C1 Baru</p>
                            <p className="text-sm text-gray-600">
                                (
                                {formatNumber(
                                    secondIteration[0]?.centroid_c1_x
                                )}
                                ,{" "}
                                {formatNumber(
                                    secondIteration[0]?.centroid_c1_y
                                )}
                                )
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">C2 Baru</p>
                            <p className="text-sm text-gray-600">
                                (
                                {formatNumber(
                                    secondIteration[0]?.centroid_c2_x
                                )}
                                ,{" "}
                                {formatNumber(
                                    secondIteration[0]?.centroid_c2_y
                                )}
                                )
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderThirdIteration = () => (
        <div className="mt-4">
            <h4 className="text-lg font-medium mb-4">
                Iterasi 3 - Hasil Perhitungan
            </h4>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-orange-600">
                        <tr>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Lama Pemakaian
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Frekuensi Kerusakan
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Jarak ke C1
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Jarak ke C2
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Jarak Terdekat
                            </th>
                            <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                Cluster
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {thirdIteration?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                    {item.lama_pemakaian}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                    {item.frekuensi_kerusakan}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-blue-50">
                                    {formatNumber(item.jarak_c1)}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-green-50">
                                    {formatNumber(item.jarak_c2)}
                                </td>
                                <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-yellow-50">
                                    {formatNumber(item.jarak_terdekat)}
                                </td>
                                <td className="px-4 py-2 text-md text-center bg-orange-50">
                                    <span
                                        className={`inline-flex px-2 py-1 text-sm font-semibold rounded-md ${
                                            item.cluster === "C1"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-blue-200 text-blue-800"
                                        }`}
                                    >
                                        {item.cluster}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {thirdIteration?.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-medium text-orange-800 mb-2">
                        Centroid Final Iterasi 3:
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">C1 Final</p>
                            <p className="text-sm text-gray-600">
                                (
                                {formatNumber(thirdIteration[0]?.centroid_c1_x)}
                                ,{" "}
                                {formatNumber(thirdIteration[0]?.centroid_c1_y)}
                                )
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <p className="font-medium">C2 Final</p>
                            <p className="text-sm text-gray-600">
                                (
                                {formatNumber(thirdIteration[0]?.centroid_c2_x)}
                                ,{" "}
                                {formatNumber(thirdIteration[0]?.centroid_c2_y)}
                                )
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderMaintenanceSchedule = () => (
        <div className="mt-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
                <h4 className="text-xl font-bold mb-2">Jadwal Perawatan AC</h4>
                <p className="text-blue-100">
                    Berdasarkan hasil clustering K-means, berikut rekomendasi
                    jadwal perawatan AC
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center mb-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <h5 className="text-lg font-semibold text-green-800">
                            Cluster 1 - Prioritas Rendah/Sedang
                        </h5>
                    </div>
                    <div className="space-y-2">
                        <p className="text-green-700">
                            <span className="font-medium">Interval:</span> 3-6
                            bulan
                        </p>
                        <p className="text-green-700">
                            <span className="font-medium">Jenis:</span>{" "}
                            Perawatan Rutin & Pembersihan
                        </p>
                        <p className="text-sm text-green-600">
                            AC dengan kondisi stabil, frekuensi kerusakan
                            rendah, cocok untuk perawatan berkala.
                        </p>
                    </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-center mb-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                        <h5 className="text-lg font-semibold text-red-800">
                            Cluster 2 - Prioritas Tinggi
                        </h5>
                    </div>
                    <div className="space-y-2">
                        <p className="text-red-700">
                            <span className="font-medium">Interval:</span> 1-2
                            bulan
                        </p>
                        <p className="text-red-700">
                            <span className="font-medium">Jenis:</span>{" "}
                            Perawatan Intensif & Monitoring
                        </p>
                        <p className="text-sm text-red-600">
                            AC dengan frekuensi kerusakan tinggi, memerlukan
                            perhatian khusus dan perawatan lebih sering.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
                <h5 className="font-semibold mb-3 text-gray-800">
                    Manfaat Clustering untuk Jadwal Perawatan:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                            📊
                        </div>
                        <h6 className="font-medium text-gray-700">
                            Efisiensi Biaya
                        </h6>
                        <p className="text-sm text-gray-600">
                            Perawatan berdasarkan kebutuhan, bukan jadwal umum
                        </p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                            ⚡
                        </div>
                        <h6 className="font-medium text-gray-700">
                            Pencegahan Kerusakan
                        </h6>
                        <p className="text-sm text-gray-600">
                            Identifikasi AC berisiko tinggi lebih awal
                        </p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                            🎯
                        </div>
                        <h6 className="font-medium text-gray-700">
                            Prioritas Jelas
                        </h6>
                        <p className="text-sm text-gray-600">
                            Fokus sumber daya pada AC yang paling membutuhkan
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    href={route("jadwal")}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                    </svg>
                    Lihat Jadwal Lengkap & Analisis Detail
                </Link>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    🔧 Optimalisasi Jadwal Perawatan AC
                </h2>
            }
        >
            <Head title="Clustering Data" />

            <div className="py-12">
                <div className="mx-auto max-w-[1600px] sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <div className="text-sm text-green-700">
                                {flash.success}
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">
                                {flash.error}
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="min-w-ful p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    Proses Clustering
                                </h3>
                                <div className="text-center">
                                    <div className="text-md text-gray-900">
                                        Total data :{" "}
                                        {centroidProcess?.data?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Status:{" "}
                                        {current_iteration === 0
                                            ? "Belum dimulai"
                                            : current_iteration === 1
                                            ? "Iterasi 1 selesai"
                                            : current_iteration === 2
                                            ? "Iterasi 2 selesai"
                                            : current_iteration === 3
                                            ? "Iterasi 3 selesai (Selesai)"
                                            : "Tidak diketahui"}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleIterasiPertama}
                                        disabled={
                                            isProcessingAll ||
                                            current_iteration > 0
                                        }
                                        className={`py-2 px-4 rounded-md text-white ${
                                            current_iteration > 0
                                                ? "bg-green-500"
                                                : isProcessingAll
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                    >
                                        {current_iteration > 0
                                            ? "✓ Iterasi 1"
                                            : "Iterasi 1"}
                                    </button>

                                    <button
                                        onClick={handleIterasiKedua}
                                        disabled={
                                            isProcessingAll ||
                                            current_iteration < 1 ||
                                            current_iteration > 1
                                        }
                                        className={`py-2 px-4 rounded-md text-white ${
                                            current_iteration > 1
                                                ? "bg-green-500"
                                                : current_iteration < 1
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : isProcessingAll
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                    >
                                        {current_iteration > 1
                                            ? "✓ Iterasi 2"
                                            : "Iterasi 2"}
                                    </button>

                                    <button
                                        onClick={handleIterasiKetiga}
                                        disabled={
                                            isProcessingAll ||
                                            current_iteration < 2 ||
                                            current_iteration > 2
                                        }
                                        className={`py-2 px-4 rounded-md text-white ${
                                            current_iteration > 2
                                                ? "bg-green-500"
                                                : current_iteration < 2
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : isProcessingAll
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                    >
                                        {current_iteration > 2
                                            ? "✓ Iterasi 3"
                                            : "Iterasi 3"}
                                    </button>

                                    <button
                                        onClick={handleUjiSemua}
                                        disabled={isProcessingAll}
                                        className={`py-2 px-4 rounded-md text-white ${
                                            isProcessingAll
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {isProcessingAll ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
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
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Memproses...
                                            </>
                                        ) : (
                                            "Uji Semua Data"
                                        )}
                                    </button>

                                    <button
                                        onClick={handleResetIterasi}
                                        disabled={
                                            isProcessingAll ||
                                            current_iteration === 0
                                        }
                                        className={`py-2 px-4 rounded-md text-white ${
                                            current_iteration === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : isProcessingAll
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >
                                        Reset Iterasi
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Kode AC
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Terakhir Service
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Lama Pemakaian
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Frekuensi Kerusakan
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    C1
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    C2
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Jarak Terdekat
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Cluster
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                                >
                                                    Aksi
                                                </th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {centroidProcess?.data?.length >
                                            0 ? (
                                                centroidProcess.data.map(
                                                    (item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                                                                {item
                                                                    .data_unit_ac
                                                                    ?.ac
                                                                    ?.code_ac ||
                                                                    "-"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                                                                {
                                                                    item
                                                                        .data_unit_ac
                                                                        ?.date_service
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                                                                {
                                                                    item
                                                                        .data_unit_ac
                                                                        ?.cluster_first_id
                                                                }{" "}
                                                                bulan
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                                                                {
                                                                    item
                                                                        .data_unit_ac
                                                                        ?.cluster_second_id
                                                                }{" "}
                                                                kali
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 bg-blue-50">
                                                                {formatNumber(
                                                                    item.result_first_cluster
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 bg-green-50">
                                                                {formatNumber(
                                                                    item.result_second_cluster
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 bg-yellow-50">
                                                                {formatNumber(
                                                                    item.closest_distance
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 bg-purple-50">
                                                                <span
                                                                    className={`inline-flex rounded-md px-2 py-1 text-sm font-semibold ${
                                                                        item.summary_cluster ===
                                                                        1
                                                                            ? "bg-green-200 text-green-800"
                                                                            : item.summary_cluster ===
                                                                              2
                                                                            ? "bg-blue-200 text-blue-800"
                                                                            : "bg-gray-200 text-gray-800"
                                                                    }`}
                                                                >
                                                                    {item.summary_cluster
                                                                        ? `Cluster ${item.summary_cluster}`
                                                                        : "Belum diuji"}
                                                                </span>
                                                            </td>
                                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <button
                                                                    onClick={() =>
                                                                        handleUjiKlaster(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isProcessing ===
                                                                            item.id ||
                                                                        processing ||
                                                                        isProcessingAll
                                                                    }
                                                                    className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                                                                        isProcessing ===
                                                                            item.id ||
                                                                        processing ||
                                                                        isProcessingAll
                                                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                                                            : "bg-red-600 text-white hover:bg-red-700"
                                                                    }`}
                                                                >
                                                                    {isProcessing ===
                                                                    item.id ? (
                                                                        <>
                                                                            <svg
                                                                                className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                                                                                />
                                                                                <path
                                                                                    className="opacity-75"
                                                                                    fill="currentColor"
                                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                />
                                                                            </svg>
                                                                            Memproses...
                                                                        </>
                                                                    ) : (
                                                                        "Test"
                                                                    )}
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="9"
                                                        className="px-6 py-4 text-center text-gray-500"
                                                    >
                                                        Tidak ada data yang
                                                        tersedia
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {centroidProcess?.links && (
                                <div className="mt-4">
                                    <Pagination links={centroidProcess.links} />
                                </div>
                            )}
                            {/* Tampilkan Tabel Iterasi 2 jika ada data */}
                            {secondIteration?.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-purple-700">
                                        Iterasi 2 - Hasil Perhitungan K-Means
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                            <thead className="bg-purple-600">
                                                <tr>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Lama Pemakaian
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Frekuensi Kerusakan
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Jarak ke C1
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Jarak ke C2
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Jarak Terdekat
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Cluster
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {secondIteration?.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                                                {
                                                                    item.cluster_first_id
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                                                {
                                                                    item.cluster_second_id
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-blue-50">
                                                                {formatNumber(
                                                                    item.result_first_cluster
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-green-50">
                                                                {formatNumber(
                                                                    item.result_second_cluster
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-yellow-50">
                                                                {formatNumber(
                                                                    item.closest_distance
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 text-md text-center bg-purple-50">
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-sm font-semibold rounded-md ${
                                                                        item.summary_cluster ===
                                                                        1
                                                                            ? "bg-green-200 text-green-800"
                                                                            : "bg-blue-200 text-blue-800"
                                                                    }`}
                                                                >
                                                                    C
                                                                    {
                                                                        item.summary_cluster
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Centroid Baru Iterasi 2 */}
                                    {secondIteration?.length > 0 && (
                                        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                                            <h5 className="font-medium text-purple-800 mb-2">
                                                Centroid Baru Iterasi 2:
                                            </h5>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded border">
                                                    <p className="font-medium">
                                                        C1 Baru
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Data dari iterasi 2
                                                        tersedia (
                                                        {secondIteration.length}{" "}
                                                        data)
                                                    </p>
                                                </div>
                                                <div className="bg-white p-3 rounded border">
                                                    <p className="font-medium">
                                                        C2 Baru
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Data dari iterasi 2
                                                        tersedia (
                                                        {secondIteration.length}{" "}
                                                        data)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Tampilkan Tabel Iterasi 3 jika ada data */}
                            {thirdIteration?.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-purple-700">
                                        Iterasi 3 - Hasil Perhitungan K-Means
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                            <thead className="bg-purple-600">
                                                <tr>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Lama Pemakaian
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Frekuensi Kerusakan
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Jarak ke C1
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Jarak ke C2
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Jarak Terdekat
                                                    </th>
                                                    <th className="px-6 py-5 text-center border text-sm font-bold text-white uppercase tracking-wider">
                                                        Cluster
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {thirdIteration?.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                                                {
                                                                    item.cluster_first_id
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900">
                                                                {
                                                                    item.cluster_second_id
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-blue-50">
                                                                {formatNumber(
                                                                    item.result_first_cluster
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-green-50">
                                                                {formatNumber(
                                                                    item.result_second_cluster
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 border-r text-md text-center text-gray-900 bg-yellow-50">
                                                                {formatNumber(
                                                                    item.closest_distance
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 text-md text-center bg-orange-50">
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-sm font-semibold rounded-md ${
                                                                        item.summary_cluster ===
                                                                        1
                                                                            ? "bg-green-200 text-green-800"
                                                                            : "bg-blue-200 text-blue-800"
                                                                    }`}
                                                                >
                                                                    C
                                                                    {
                                                                        item.summary_cluster
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Centroid Final Iterasi 3 */}
                                    {thirdIteration?.length > 0 && (
                                        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                                            <h5 className="font-medium text-orange-800 mb-2">
                                                Centroid Final Iterasi 3:
                                            </h5>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded border">
                                                    <p className="font-medium">
                                                        C1 Final
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Data dari iterasi 3
                                                        tersedia (
                                                        {thirdIteration.length}{" "}
                                                        data)
                                                    </p>
                                                </div>
                                                <div className="bg-white p-3 rounded border">
                                                    <p className="font-medium">
                                                        C2 Final
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Data dari iterasi 3
                                                        tersedia (
                                                        {thirdIteration.length}{" "}
                                                        data)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}{" "}
                            {/* Tampilkan hasil clustering jika ada data */}
                            {(centroids.length > 0 ||
                                iterations.length > 0) && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Hasil Clustering K-Means
                                    </h3>

                                    {/* Tab Navigation */}
                                    <div className="border-b border-gray-200">
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
                                                                setSelectedTab(
                                                                    index
                                                                )
                                                            }
                                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                                selectedTab ===
                                                                index
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
                                    <div className="mt-4">
                                        {selectedTab === 0 &&
                                            renderClusterResults()}
                                        {selectedTab === 1 &&
                                            renderIterationDetails()}
                                        {selectedTab === 2 &&
                                            renderSecondIteration()}
                                        {selectedTab === 3 &&
                                            renderThirdIteration()}
                                        {selectedTab === 4 &&
                                            renderMaintenanceSchedule()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
