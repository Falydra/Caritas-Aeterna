import * as React from "react";
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/react";
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
import { PageData, MenuItem } from "@/config/page_data";
import { DoneePage } from "@/config/donee_page";

export function AppSidebar({
    onMenuItemClick,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    onMenuItemClick: (title: string) => void;
}) {
    const { component } = usePage();
    const [activeItem, setActiveItem] = useState<string>(
        PageData.mainPage.items[0].title
    );

    useEffect(() => {
        const activeMenuItem = PageData.mainPage.items.find(
            (item) => item.route && route().current(item.route)
        );

        if (activeMenuItem) {
            setActiveItem(activeMenuItem.title);
        }
    }, [component]);

    const handleMenuItemClick = (title: string, url: string) => {
        setActiveItem(title);
        onMenuItemClick(title);
        Inertia.visit(url);
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        Inertia.visit(route("logout"));
    };

    const { auth } = usePage().props;
    console.log("Roles Appsidebar:", auth.roles);
    console.log(DoneePage.mainPage.items);

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]}
                    defaultVersion={"1.0.1"}
                />
                {/* <SearchForm /> */}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {auth.roles === "donee"
                                ? DoneePage.mainPage.items.map(
                                      (doneMenuItem: MenuItem) => (
                                          <SidebarMenuItem
                                              key={doneMenuItem.title}
                                          >
                                              <SidebarMenuButton
                                                  asChild
                                                  isActive={
                                                      activeItem ===
                                                      doneMenuItem.title
                                                  }
                                                  onClick={() =>
                                                      handleMenuItemClick(
                                                          doneMenuItem.title,
                                                          doneMenuItem.url
                                                      )
                                                  }
                                              >
                                                  <a href={doneMenuItem.url}>
                                                      {doneMenuItem.title}
                                                  </a>
                                              </SidebarMenuButton>
                                          </SidebarMenuItem>
                                      )
                                  )
                                : PageData.mainPage.items.map(
                                      (menuItem: MenuItem) => (
                                          <SidebarMenuItem key={menuItem.title}>
                                              <SidebarMenuButton
                                                  asChild
                                                  isActive={
                                                      activeItem ===
                                                      menuItem.title
                                                  }
                                                  onClick={() =>
                                                      handleMenuItemClick(
                                                          menuItem.title,
                                                          menuItem.url
                                                      )
                                                  }
                                              >
                                                  <a href={menuItem.url}>
                                                      {menuItem.title}
                                                  </a>
                                              </SidebarMenuButton>
                                          </SidebarMenuItem>
                                      )
                                  )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Link
                    href={route("logout")}
                    method="post"
                    className="flex flex-row gap-2 items-center absolute bottom-0 justify-center px-4 w-full h-16 hover:bg-red-500 cursor-pointer bg-primary-bg"
                >
                    {}
                    <IoIosLogOut className="w-6 h-6 text-primary-fg" />
                    <span className="text-primary-fg">Logout</span>
                </Link>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
