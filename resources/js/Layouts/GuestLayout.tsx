import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

import { PropsWithChildren } from "react";


export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen w-full items-center overflow-y-hidden flex-col bg-primary-bg pt-6 sm:justify-center sm:pt-0">
            <Navbar />

            <div>

                {children}
            </div>
            
            <Footer />  

        </div>
    );
}
