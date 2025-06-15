import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-blue-600 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-white drop-shadow-lg tracking-wide text-center">
                Sistem <span className="text-yellow-300">Optimalisasi</span>{" "}
                Jadwal <span className="text-cyan-200">Perawatan AC</span>
            </h1>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
