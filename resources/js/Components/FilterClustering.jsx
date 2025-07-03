export default function FilterClustering({
    filter,
    setFilter,
    list_bulan = [],
    list_tahun = [],
    onSubmit,
}) {
    return (
        <div className="items-center space-x-4">
            <form onSubmit={onSubmit}>
                <label className="text-md">Tahun :</label>
                <select
                    value={filter.bulan || ""}
                    onChange={(e) =>
                        setFilter({ ...filter, bulan: e.target.value })
                    }
                    className="border ml-5 w-56 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Semua</option>
                    {list_bulan.map((bulan) => (
                        <option key={bulan} value={bulan}>
                            {new Date(0, bulan - 1).toLocaleString("id-ID", {
                                month: "long",
                            })}
                        </option>
                    ))}
                </select>

                <label className="text-md ml-10">Jumlah Klaster :</label>
                <select
                    value={filter.tahun || ""}
                    onChange={(e) =>
                        setFilter({ ...filter, tahun: e.target.value })
                    }
                    className="border ml-5 w-56 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Semua</option>
                    {list_tahun.map((tahun) => (
                        <option key={tahun} value={tahun}>
                            {tahun}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-indigo-600 ml-10 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                    Klusterisasi
                </button>
            </form>
        </div>
    );
}
