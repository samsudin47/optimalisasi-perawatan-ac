export default function Filter({ filter, setFilter, options }) {
    return (
        <div className="flex items-center space-x-4">
            <h1>Filter Data Unit AC</h1>
            <label
                htmlFor="filter"
                className="text-md font-medium text-gray-700"
            >
                Status :
            </label>
            <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
