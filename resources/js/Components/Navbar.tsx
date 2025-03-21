import { User } from "@/types";
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/react";
import { IoPersonOutline } from "react-icons/io5";

export default function Navbar(user: User) {
    const {auth} = usePage().props;
    return (
        <div className="w-full fixed h-[60px] bg-primary-fg top-0 left-0 z-20 ">
                <div className="flex-row flex w-full h-[60px] backdrop-blur-sm z-15 text-primary-bg   items-center justify-center top-0 left-0 sticky">
                    <div className="flex w-full h-full items-center justify-center">
                        <div className="flex w-full items-center justify-start">
                            {/* <img src="images/Screenshot_2025-01-02_195749-removebg-preview.png" className="w-auto flex h-16" /> */}
                        </div>
                        <div className="flex w-full items-center justify-around ">
                        
                        <h1>
                            Home
                        </h1>
                        <h2>
                            About
                        </h2>
                            <h3>
                                Contact
                            </h3>
                        </div>
                          {!auth.user ? (
                              <div className="flex w-full items-end justify-end px-4">
                                <Link href={route("login")} className="items-center justify-end mr-3 hover:text-primary-accent cursor-pointer " onClick={() => Inertia.get('/login')}>
                                    Login
                                </Link>
                            </div>
                        ) : (
                            <div className="flex w-full items-end justify-end px-4">
                            
                            <div
                            className="w-12 h-12 flex items-center aspect-square justify-center rounded-full bg-primary-bg cursor-pointer text-primary-fg"
                            onClick={() => Inertia.get('dashboard')}
                            >
                            <IoPersonOutline className="w-5 h-5" />
                            </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
    )
}