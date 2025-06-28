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
import { Separator } from "./ui/separator";
import { DoneeApplication } from "@/types";



export function AppSidebar({
    isMoreGroup = false,
    onMenuItemClick,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    onMenuItemClick: (title: string) => void;
} & {isMoreGroup?: boolean}) {
    const { auth } = usePage().props;
    const { doneeApplicationStatus } = usePage().props as any;


    
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
    let profileItems: MenuItem[] = [];
    if (auth.roles === "donee") {
        menuItems = DoneePage.mainPage.items;
    } else if (auth.roles === "donor") {
        menuItems = DonorPage.mainPage.items;
        profileItems = DonorPage.mainPage.profileItems;
    } else if (auth.roles === "admin") {
        menuItems = AdminPage.mainPage.items;
    } else {
        menuItems = SuperAdminPage.mainPage.items;
    }

   const allMenuItems = [...menuItems, ...profileItems];
    const activeMenu = allMenuItems
  .filter(item => currentPath.startsWith(item.url))
  .sort((a, b) => b.url.length - a.url.length)[0];

    const resetActiveMenu = () => {
        menuItems.forEach(item => {
            item.isActive = false;
        });
    };

    const resetProfileActiveMenu = () => {
        profileItems.forEach(item => {
            item.isActive = false;
        });
    };


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

    const renderProfileMenu = (profileItems: MenuItem[]) =>
    profileItems.map((profileItem: MenuItem) => {
        const isDoneeRegister = profileItem.route === "donor.donee-register-form";
        const disabled = isDoneeRegister && doneeApplicationStatus && (doneeApplicationStatus === "pending");

        return (
            <SidebarMenuItem key={profileItem.title}>
                <SidebarMenuButton
                    asChild
                    disabled={disabled}
                    className={disabled ? "opacity-50 pointer-events-none" : ""}
                >
                    <a href={profileItem.url}>{profileItem.title}</a>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    });

    if (auth.roles === "donor") {
        isMoreGroup = true;
    }

    // console.log("profileItems:", profileItems);
    // console.log("Current Path:", currentPath);
    // console.log("Current User Role:", auth.roles);
    // console.log("isActiveMenu:", activeMenu);

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]}
                    defaultVersion={"1.0.1"}
                />
                <Separator className=""/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {renderMenuItems(menuItems)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    {isMoreGroup && (
                        <>
                            <SidebarGroupLabel className="mt-4">Profile</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {renderProfileMenu(profileItems)}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </>
                    )}
                </SidebarGroup>

            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
