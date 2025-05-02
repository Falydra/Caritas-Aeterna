import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/react";
import { IoPersonOutline } from "react-icons/io5";

export default function Navbar() {
    const { auth } = usePage().props;

    const dashboardIdentifier =
        auth.roles === "super-admin"
            ? "/dashboard/super-admin"
            : auth.roles === "admin"
            ? "/dashboard/admin"
            : auth.roles === "donor"
            ? "/dashboard"
            : auth.roles === "donee"
            ? "/dashboard/donee"
            : "/";

    console.log(auth.user);
    console.log(auth);
    if (auth.roles) {
        console.log("Role:", auth.roles);
    }

    return (
        <div className="w-full fixed h-[80px] bg-primary-fg top-0 left-0 z-20 ">
            <div className="flex-row flex w-full h-[80px] backdrop-blur-sm z-15 text-primary-bg   items-center justify-center top-0 left-0 sticky">
                <div className="flex w-full h-full items-center justify-center">
                    <Link
                        href={route("welcome")}
                        className="flex w-full items-center justify-start flex-row px-8"
                    >
                        <img
                            src="/images/Logo_Undip_Full-removebg-preview.png"
                            className="w-auto flex h-12"
                        />
                    </Link>
                    <div className="flex w-full items-center justify-around ">
                        <h1>Home</h1>
                        <h2>About</h2>
                        <h3>Contact</h3>
                    </div>
                    {!auth.user ? (
                        <div className="flex w-full items-end justify-end px-4">
                            <Link
                                href={route("login")}
                                className="items-center justify-end mr-3 hover:text-primary-accent cursor-pointer "
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
