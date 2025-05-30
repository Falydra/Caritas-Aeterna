
export interface MenuItem {
    title: string;
    url: string;
    isActive?: boolean;
    route: string;
}




export const SuperadminPage = {
    mainPage: {
        items: [
            {
                title: "Admin Panel",
                url: "/dashboard/super-admin",
                isActive: false,
                route: "super-admin.dashboard",
            },
        ] as MenuItem[],
    },
};