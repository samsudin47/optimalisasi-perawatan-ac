export default function Selectbox({
    className = "",
    options = [],
    currentValue = "",
    ...props
}) {
    return (
        <select
            {...props}
            value={currentValue}
            className={
                "rounded border-gray-300 text-black shadow-sm focus:ring-indigo-500" +
                className
            }
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
