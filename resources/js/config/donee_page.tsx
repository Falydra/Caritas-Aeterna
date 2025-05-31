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
                title: "Create Donation",
                url: "/dashboard/donee/create-donation",
                isActive: false,
                route: "donee.init",
            },
            {
                title: "Active Donation",
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
