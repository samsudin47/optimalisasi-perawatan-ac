import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FilterClustering from "@/Components/FilterClustering";
import React from "react";
import { Head, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function ClusteringIndex({
    filter = {},
    list_bulan = [],
    list_tahun = [],
    centroids = [],
    iterations = [],
    selisih_klaster = null,
    centroidProcess,
}) {
    const [filterState, setFilterState] = React.useState({
        bulan: filter.bulan || "",
        tahun: filter.tahun || "",
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route("clustering-data.index"), filterState, {
            preserveState: true,
            replace: true,
        });
    };

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
                    {/* Filter */}
                    <div className="bg-white shadow-sm sm:rounded-lg my-10">
                        <div className="p-6 text-gray-900">
                            <FilterClustering
                                filter={filterState}
                                setFilter={setFilterState}
                                list_bulan={list_bulan}
                                list_tahun={list_tahun}
                                onSubmit={handleFilter}
                            />
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                    <thead className="bg-blue-600">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                            >
                                                Code AC
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Lama Pemakaian
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Frekuensi Kerusakan
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                C1
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                C2
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm  border font-bold text-white uppercase tracking-wider"
                                            >
                                                Jarak Terdekat
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Klaster
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {centroidProcess?.data?.map(
                                            (centroidProcessed) => (
                                                <tr key={centroidProcessed.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed
                                                            .data_unit_ac?.ac
                                                            ?.code_ac || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed
                                                            .data_unit_ac
                                                            ?.cluster_first_id ||
                                                            "-"}{" "}
                                                        bulan
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed
                                                            .data_unit_ac
                                                            ?.cluster_second_id ||
                                                            "-"}{" "}
                                                        kali
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed.result_first_cluster ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed.result_second_cluster ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed.closest_distance ||
                                                            "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {centroidProcessed.summary_cluster ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {centroidProcess?.links && (
                                <Pagination links={centroidProcess.links} />
                            )}
                        </div>
                    </div>

                    {/* Hasil K-Means */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 text-gray-900">
                            <h3 className="font-bold mb-2">
                                Centroid & Iterasi K-Means
                            </h3>
                            {[1, 2, 3].map((idx) => (
                                <div key={idx} className="mb-4">
                                    <div className="font-semibold text-blue-700">
                                        Centroid Proses {idx}
                                    </div>
                                    <pre className="bg-gray-100 p-2 rounded text-xs">
                                        {centroids[idx - 1]
                                            ? JSON.stringify(
                                                  centroids[idx - 1],
                                                  null,
                                                  2
                                              )
                                            : "-"}
                                    </pre>
                                    <div className="font-semibold text-green-700 mt-2">
                                        Iterasi {idx}
                                    </div>
                                    <pre className="bg-gray-100 p-2 rounded text-xs">
                                        {iterations[idx - 1]
                                            ? JSON.stringify(
                                                  iterations[idx - 1],
                                                  null,
                                                  2
                                              )
                                            : "-"}
                                    </pre>
                                </div>
                            ))}
                            <div className="font-semibold text-red-700 mt-4">
                                Selisih antar klaster:
                            </div>
                            <pre className="bg-gray-100 p-2 rounded text-xs">
                                {selisih_klaster
                                    ? JSON.stringify(selisih_klaster, null, 2)
                                    : "-"}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
