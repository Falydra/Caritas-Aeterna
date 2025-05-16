
export interface MenuItem {
    title: string;
    url: string;
    isActive?: boolean;
    route: string;
}




export const PageData = {
    mainPage: {
        items: [
            {
                title: "Books",
                url: "/dashboard",
                isActive: false,
                route: "dashboard",
            },
            {
                title: "Cart",
                url: "/dashboard/cart",
                isActive: false,
                route: "cart",
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