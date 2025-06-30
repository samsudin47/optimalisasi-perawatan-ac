import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Filter from "@/Components/Filter";

export default function MasterAcIndex({ data_unit_ac }) {
    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus data ini?")) {
            router.delete(route("data-unit-ac.destroy", id));
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Data Customer Pengguna AC
                </h2>
            }
        >
            <Head title="Data Customer Pengguna AC" />

            <div className="py-12">
                <div className="mx-auto max-w-[1600px] sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <label>Total Data AC : {data_unit_ac.total}</label>

                        <Link
                            href={route("data-unit-ac.create")}
                            className="bg-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                            Add Customer
                        </Link>
                    </div>
                    {/* component filter */}
                    <div className="bg-white shadow-sm sm:rounded-lg my-10">
                        <div className="p-6 text-gray-900">
                            <Filter
                                filter={data_unit_ac.filter}
                                setFilter={data_unit_ac.setFilter}
                                options={[
                                    { value: "all", label: "Semua" },
                                    { value: "active", label: "Aktif" },
                                    { value: "inactive", label: "Tidak Aktif" },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                    <thead className="bg-blue-600">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left border text-sm font-bold text-white uppercase tracking-wider"
                                            >
                                                Customer
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Kode Merk AC
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Alamat
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                No Telepon
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Terakhir Service
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm  border font-bold text-white uppercase tracking-wider"
                                            >
                                                Lama Pemakaian (Bulan)
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Frekuensi Kerusakan (Kali)
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Merek
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Keterangan
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-5 text-left text-sm border font-bold text-white uppercase tracking-wider"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data_unit_ac.data.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.name_customer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.ac?.code_ac ?? "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.addrees}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.phone}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.date_service}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.cluster_first_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.cluster_second_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.merk}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.status?.status ?? "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.information}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        href={route(
                                                            "data-unit-ac.edit",
                                                            item.id
                                                        )}
                                                        className="inline-flex items-center mx-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPenToSquare}
                                                        />
                                                    </Link>
                                                    <Link
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="inline-flex items-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={data_unit_ac.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
