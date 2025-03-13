import React from "react";
import NavLink from "./NavLink";
// import Navbar from "./Navbar";
// import Footer from "@/Components/Footer";
import { Head } from "@inertiajs/react";

interface LayoutData {
    children: React.ReactNode;
    description?: string;
    pageTitle?: string;
    className?: string;
}

export default function Layout(props: LayoutData) {
    const { children, description, pageTitle, className } = props;
    return (
        <div className={"overflow-y-hidden ${className}"}>
            <div className="container mx-auto">
                <meta name="description" content={description} />
            </div>
            <div>
                <Head title={pageTitle} />
                {/* <Navbar /> */}
                {children}
                {/* <Footer /> */}
            </div>
        </div>
    );
}
