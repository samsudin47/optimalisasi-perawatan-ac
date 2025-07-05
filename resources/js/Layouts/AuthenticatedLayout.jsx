import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const menu = (role) => {
        if (user.role === "admin") {
            return [
                {
                    name: "Dashboard",
                    href: route("dashboard"),
                    current: route().current("dashboard"),
                },
                {
                    name: "Data Unit AC",
                    href: route("data-unit-ac"),
                    current: route().current("data-unit-ac"),
                },
                {
                    name: "Clustering Data",
                    href: route("clustering-data.index"),
                    current: route().current("clustering-data.index"),
                },
                {
                    name: "Jadwal",
                    href: route("dashboard"),
                    current: route().current("dashboard"),
                },
                {
                    name: "Master Data",
                    children: [
                        {
                            name: "Master Data AC",
                            href: route("master-ac"),
                            current: route().current("master-ac"),
                        },
                        {
                            name: "Master Clustering",
                            href: route("master-clustering"),
                            current: route().current("master-clustering"),
                        },
                    ],
                },
                {
                    name: "Data Pengguna",
                    href: route("users"),
                    current: route().current("users"),
                },
            ];
        } else {
            return [
                {
                    name: "Dashboard",
                    href: route("dashboard"),
                    current: route().current("dashboard"),
                },
            ];
        }
    };

    const navigation = menu(user.role);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-blue-600 fixed top-0 left-0 w-full z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {navigation.map((item) =>
                                    item.children ? (
                                        <div
                                            key={item.name}
                                            className="relative group py-3"
                                        >
                                            <button className="text-white px-4 py-2 hover:text-amber-300">
                                                {item.name}
                                            </button>
                                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition z-50">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-300 hover:text-blue-600 hover:rounded-md"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`text-white py-5 rounded-md text-base hover:text-amber-300 ${
                                                item.current ? "" : ""
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {menu(user.role).map((item, index) => {
                            return (
                                <ResponsiveNavLink
                                    key={index}
                                    href={item.href}
                                    className={`text-white py-5 rounded-md text-sm font-medium hover:text-amber-300 ${
                                        item.current ? "bg-gray-900" : ""
                                    }`}
                                >
                                    {item.name}
                                </ResponsiveNavLink>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow mt-14">
                    <div className="mx-auto  max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
