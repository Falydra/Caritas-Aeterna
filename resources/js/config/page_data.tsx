export interface MenuItem {
    title: string;
    url: string;
    isActive?: boolean;
    route: string;
}

export const DonorPage = {
    mainPage: {
        items: [
            {
                title: "Books",
                url: "/dashboard/donor",
                isActive: false,
                route: "dashboard",
            },
            {
                title: "Riwayat Donasi",
                url: "/dashboard/donor/donation-history",
                isActive: false,
                route: "/dashboard/donor/donation-history"
            },
        
        ] as MenuItem[],
        profileItems: [
            {
                title: "Profile",
                url: "/dashboard/donor/profile",
                isActive: false,
                route: "donor.profile",
            },
            {
                title: "Registrasi Inisiator Donasi",
                url: "/dashboard/donor/profile/register-donee",
                isActive: false,
                route: "donor.donee-register-form",
            },
        ] as MenuItem[],
    },
};

export const DoneePage = {
    mainPage: {
        items: [
            {
                title: "Donasi Dibuka",
                url: "/dashboard/donee/donations",
                isActive: false,
                route: "donee.donations.index",
            },
            {
                title: "Buka Donasi Baru",
                url: "/dashboard/donee/create-donation",
                isActive: false,
                route: "donee.init",
            },
            {
                title: "Modifikasi Donasi",
                url: "/dashboard/donee/edit-donation",
                isActive: false,
                route: "donee.init",
            },
            {
                title: "Profile",
                url: "/dashboard/donee/profile",
                isActive: false,
                route: "donee.profile",
            },
        ] as MenuItem[],
    },
};

export const AdminPage = {
    mainPage: {
        items: [
            {
                title: "Dashboard",
                url: "/dashboard/admin",
                isActive: false,
                route: "admin.dashboard",
            },
            {
                title: "Manage Donations",
                url: "/dashboard/admin/manage-donations",
                isActive: false,
                route: "admin.manage-donations",
            },
            {
                title: "Manage Users",
                url: "/dashboard/admin/manage-users",
                isActive: false,
                route: "admin.manage-users",
            },
            {
                title: "Manage Applications",
                url: "/dashboard/admin/manage-application",
                isActive: false,
                route: "admin.manage-application",
            },
            {
                title: "Profile",
                url: "/dashboard/admin/profile",
                isActive: false,
                route: "admin.profile",
            },
        ] as MenuItem[],
    },
};

export const SuperAdminPage = {
    mainPage: {
        items: [
            {
                title: "Dashboard",
                url: "/dashboard/super-admin",
                isActive: false,
                route: "super-admin.dashboard",
            },
            {
                title: "Manage Users",
                url: "/dashboard/super-admin/manage-users",
                isActive: false,
                route: "super-admin.manage-users",
            },
            {
                title: "Profile",
                url: "/dashboard/super-admin/profile",
                isActive: false,
                route: "super-admin.profile",
            },
        ] as MenuItem[],
    },
};
