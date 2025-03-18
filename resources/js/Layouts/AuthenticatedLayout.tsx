
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { AppSidebar } from "@/Components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";

import DonationHistory from "@/Components/DonationHistory";
import SelectedBooks from "@/Components/SelectedBooks";
import { SearchForm } from "@/Components/search-form";

export default function Authenticated({
    header,
    children,
    rightSidebarChildren,
}: PropsWithChildren<{ header?: ReactNode, rightSidebarChildren?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <SidebarProvider>
            <AppSidebar onMenuItemClick={() => {}} />
            <SidebarInset>
                <div className="flex flex-col items-start justify-start w-full h-full bg-primary-bg">
                    <header className="flex h-16 w-full items-center justify-between gap-2 border-b px-4">
                        <div className="flex flex-row w-full items-center justify-start">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="hover:text-primary-accent cursor-pointer">Book Donations</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <SearchForm className="self-center w-full " />
                    </header>
                    {children}
                </div>
                {/* <div className="flex flex-col overflow-y-auto h-full items-start justify-start"> */}


                    {rightSidebarChildren}
                {/* </div> */}
            </SidebarInset>
        </SidebarProvider>
    );
}