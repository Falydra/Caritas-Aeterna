export interface MenuItem {
    title: string;
    url: string;
    isActive?: boolean;
    route: string;
}

export const DoneePage = {
    mainPage: {
        items: [
            {
                title: "Books",
                url: "/dashboard/donee",
                isActive: false,
                route: "donee.dashboard",
            },
            {
                title: "Buat Donasi",
                url: "/dashboard/donee/create-donation",
                isActive: false,
                route: "donee.init",
            },
            {
                title: "Donasi Dibuka",
                url: "/dashboard/donee/donations",
                isActive: false,
                route: "donee.donations.index"
            },
            {
                title: "Profile",
                url: "/profile",
                isActive: false,
                route: "profile",
            },
        ] as MenuItem[],
    },
};
