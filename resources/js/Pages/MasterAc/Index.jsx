import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function MasterAcIndex({ master_data_ac }) {
    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus data ini?")) {
            router.delete(route("master-ac.destroy", id));
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Master Data AC
                </h2>
            }
        >
            <Head title="Master Data AC" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <label>Total Data AC : {master_data_ac.total}</label>

                        <Link
                            href={route("master-ac.create")}
                            className="bg-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        >
                            Create New AC
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                                <thead className="bg-blue-600">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider"
                                        >
                                            Kode AC
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider"
                                        >
                                            Merk
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider"
                                        >
                                            Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {master_data_ac.data.map((master) => (
                                        <tr key={master.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {master.code_ac}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {master.merk}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {master.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "master-ac.edit",
                                                        master.id
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
                                                        handleDelete(master.id)
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
                            <Pagination links={master_data_ac.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
