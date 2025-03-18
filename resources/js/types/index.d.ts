export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
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
