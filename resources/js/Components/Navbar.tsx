import { PageProps } from "@/types";
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/react";
import { IoPersonOutline } from "react-icons/io5";

interface CustomPageProps extends PageProps {
    auth: {
        roles: string;
        user?: {
            name?: string;
            email?: string;
            role: string;
        };
    };
    url?: string;
}

export default function Navbar() {
    const { auth, url = "" } = usePage<CustomPageProps>().props;

    const dashboardIdentifier =
        auth.roles === "superadmin"
            ? "/dashboard/super-admin"
            : auth.roles === "admin"
            ? "/dashboard/admin"
            : auth.roles === "donor"
            ? "/dashboard"
            : auth.roles === "donee"
            ? "/dashboard/donee"
            : "/";

    const isActiveUrl = (path: string) => {
        if (path === "/") {
            return currentPath === "/" || currentPath === "";
        }

        return currentPath.startsWith(path);
    };

    console.log(auth.roles);
    const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <div className="w-full fixed h-[80px] bg-primary-fg top-0 left-0 z-20">
            <div className="flex-row flex w-full h-[80px] backdrop-blur-sm z-15 text-primary-bg items-center justify-center top-0 left-0 sticky">
                <div className="flex w-full h-full items-center justify-center">
                    <div className="flex w-full items-center justify-start flex-row px-8">
                        <Link
                            href={route("welcome")}
                            className="flex items-center justify-start flex-row"
                        >
                            <img
                                src="/images/LogoYayasan.png"
                                className="w-auto flex h-12"
                            />
                        </Link>
                    </div>

                    <div className="flex w-full items-center justify-around">
                        <Link
                            href={route("welcome")}
                            className={`hover:text-primary-accent px-4 py-2 ${
                                isActiveUrl("/")
                                    ? "border-b-4 border-primary-bg"
                                    : ""
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href={route("news")}
                            className={`hover:text-primary-accent px-4 py-2 ${
                                isActiveUrl("/news")
                                    ? "border-b-4 border-primary-bg"
                                    : ""
                            }`}
                        >
                            News
                        </Link>
                        <Link
                            href={route("donation")}
                            className={`hover:text-primary-accent px-4 py-2 ${
                                isActiveUrl("/donation")
                                    ? "border-b-4 border-primary-bg"
                                    : ""
                            }`}
                        >
                            Donation
                        </Link>
                    </div>

                    {!auth.user ? (
                        <div className="flex w-full items-end justify-end px-4">
                            <Link
                                href={route("login")}
                                className="items-center justify-end mr-3 hover:text-primary-accent cursor-pointer"
                                onClick={() => Inertia.get("/login")}
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <div className="flex w-full items-end justify-end px-4">
                            <Link
                                className="w-12 h-12 flex items-center aspect-square justify-center rounded-full bg-primary-bg cursor-pointer text-primary-fg"
                                href={dashboardIdentifier}
                            >
                                <IoPersonOutline className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
