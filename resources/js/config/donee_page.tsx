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
                title: "Payment",
                url: "/dashboard/payment",
                isActive: false,
                route: "payment",
            },
            {
                title: "Book Donors",
                url: "/dashboard/donors",
                isActive: false,
                route: "donors",
            },
            {
                title: "Book Details",
                url: "/book-details",
                isActive: false,
                route: "book-details",
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
