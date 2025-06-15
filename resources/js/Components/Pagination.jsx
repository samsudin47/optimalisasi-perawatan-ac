import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }
    return (
        <div className="flex justify-center mt-4 space-x-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || "#"}
                    className={`${
                        link.active
                            ? "bg-indigo-600 text-white"
                            : "text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    } ${
                        !link.url ? "opacity-50 cursor-not-allowed" : ""
                    } px-4 py-2 border border-indigo-600 rounded-md`}
                    preserveScroll
                >
                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                </Link>
            ))}
        </div>
    );
}
