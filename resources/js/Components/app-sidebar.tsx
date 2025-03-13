import * as React from "react";

import { SearchForm } from "@/Components/search-form";
import { VersionSwitcher } from "@/Components/version-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { IoIosLogOut } from "react-icons/io";

// This is sample data.
const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "What will you give for today?",
            url: "#",
            items: [
                {
                    title: "Books",
                    url: "#",
                },
                {
                    title: "Add to Cart",
                    url: "#",
                    isActive: true,
                },
                {
                    title: "Payment",
                    url: "#",
                },
                {
                    title: "Book Donors",
                    url: "#",
                },
                {
                    title: "Book Details",
                    url: "#",
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={data.versions}
                    defaultVersion={data.versions[0]}
                />
                {/* <SearchForm /> */}
            </SidebarHeader>
            <SidebarContent>
                
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.isActive}
                                        >
                                            <a href={item.url}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
                <div className="flex flex-row gap-2 items-center justify-center px-4 w-full h-16 hover:bg-red-500 cursor-pointer bg-primary-bg">
                    <IoIosLogOut className="w-6 h-6 text-primary-fg" />
                    <span className="text-primary-fg">Logout</span>

                </div>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
