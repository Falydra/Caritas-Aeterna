
import { Link, usePage } from "@inertiajs/react";
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

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { IoIosLogOut } from "react-icons/io";

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
                        <div className="flex flex-row items-center justify-center ">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="w-full h-full">
                                    <Button className="w-8 h-8 aspect-square rounded-full bg-primary-fg"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                        <Link method="post" href={route("logout")} className="flex justify-between w-full h-8 items-center bg-transparent hover:bg-red-600/75 rounded-md text-primary-bg px-2 font-semibold text-sm ">
                                            Logout
                                           <IoIosLogOut className="w-4 h-4 aspect-square self-center" />
                                        </Link>
                                        </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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