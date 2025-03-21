import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

import { PropsWithChildren } from "react";


export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex h-screen w-full items-center flex-col bg-primary-bg pt-6 sm:justify-center sm:pt-0">
            <Navbar />
            <div className="w-full h-screen overflow-y-auto bg-primary-bg shadow-md">
                {children}
            </div>
            {/* <Footer />   */}

        </div>
    );
}
