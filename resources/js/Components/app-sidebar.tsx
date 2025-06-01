import * as React from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/react";
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
import { DonorPage, MenuItem, DoneePage, AdminPage, SuperAdminPage } from "@/config/page_data";
import { FaHome } from "react-icons/fa";

export function AppSidebar({
    onMenuItemClick,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    onMenuItemClick: (title: string) => void;
}) {
    const { auth } = usePage().props;

    // Get the current path
    const currentPath = window.location.pathname;

    const handleMenuItemClick = (title: string, url: string) => {
        onMenuItemClick(title);
        Inertia.visit(url);
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        Inertia.get(route("welcome") );
    };

    let menuItems: MenuItem[] = [];
    if (auth.roles === "donee") {
        menuItems = DoneePage.mainPage.items;
    } else if (auth.roles === "donor") {
        menuItems = DonorPage.mainPage.items;
    } else if (auth.roles === "admin") {
        menuItems = AdminPage.mainPage.items;
    } else {
        menuItems = SuperAdminPage.mainPage.items;
    }
    
    const activeMenu = menuItems
    .filter(item => currentPath.startsWith(item.url))
    .sort((a, b) => b.url.length - a.url.length)[0];

    // Helper to render menu items for any role
    const renderMenuItems = (items: MenuItem[]) =>
    items.map((menuItem: MenuItem) => (
        <SidebarMenuItem key={menuItem.title}>
            <SidebarMenuButton
                asChild
                isActive={activeMenu && activeMenu.url === menuItem.url}
                onClick={() => handleMenuItemClick(menuItem.title, menuItem.url)}
            >
                <a href={menuItem.url}>{menuItem.title}</a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ));


    console.log("Current Path:", currentPath);
    console.log(auth.roles);

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]}
                    defaultVersion={"1.0.1"}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {renderMenuItems(menuItems)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Link
                    href={route("welcome")}
                    className="flex flex-row gap-2 items-center absolute bottom-0 justify-center px-4 w-full h-16 hover:bg-red-500 cursor-pointer bg-primary-bg"
                >
                    <FaHome className="w-5 h-5 text-primary-fg" />
                    <span className="text-primary-fg">Home</span>
                </Link>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}