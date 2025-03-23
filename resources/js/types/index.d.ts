export interface User {
    id?: number;
    name?: string;
    email?: string;

    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user?: User;
        roles?: UserRoles;
    };
    
};

export interface AddToCartProps {
    isAdded: boolean;
    setIsAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Product = {
    id: string;
    price: number;
    quantity: number;
    Product: string;
    name: string;
    description: string;
};

export type Books = {
    id: string;
    title: string;
    author: string;
    publisher: string;
    published_date: string;
    pages: number;
    city: string;
    description: string;
    image: string;
    status?: string;
};

export type Donation = {
    user?: User;
    amount: number;
    username: string;
};

export type InitiatorDonation = {
    user: User;
    organization?: string;
    isVerified?: boolean;
    donationLimit?: number;
    donation_title?: string;
};

export type NominalDonation = {
    id: number;
    nominal: number;
};


export type Roles = {
    id: number;
    name: string;
}

export type UserRoles = {
    id: number;
    user: User;
    role: Roles;
}


export type News = {
    id: number;
    title: string;
    description: string;
    image: string;
}

