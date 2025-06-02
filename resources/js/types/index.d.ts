export type User = {
    id?: number;
    username?: string;
    email?: string;
    role: stirng;

    email_verified_at?: string;
};

//Fixed Book
export type Book = {
    title: string;
    isbn: string;
    authors: string[];
    published_year: string;
    synopsis: string;
    cover_image: string;
    price: number;
};

export type BookWithAmount = {
    book: Book;
    amount: number;
};

export type Facility = {
    id: number | string;
    name: string;
    description: string;
    dimensions: string;
    material: string;
    price: number | string;
    amount: number;
    status: boolean;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user?: User;
        roles?: string;
        // roles?: UserRoles;
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

export type Fund = {
    id: number;
    donor_donation_id: number;
    amount: number;
    // user_id: User.id;
    // transfer_date: string;
};

export type Donor = {
    id: number;
    username: string;
};

export type Fundraiser = {
    user: user;
    id: number;
    type: string;
    type_attributes: {
        [key: string]: string | number;
    };
    title: string;
    header_image: string;
    text_descriptions: {
        [key: number]: string;
    };
    image_descriptions: {
        [key: number]: string;
    };
    status: string;
    created_at: string;
    donor_donations: DonorDonations[];
};

export type DonorDonation = {
    id: number;
    donor_id: 52;
    verified_at: string;
    donor: Donor[];
    funds: Fund[];
};

export type Initiator = {
    id: number;
    username: string;
};

export type Donation = {
    initiator_id: User;
    id: number;
    type_attributes: {
        [key: string]: number;
    };
    title: string;
    header_image: string;
    text_descriptions: {
        [key: number]: string;
    };
    image_descriptions: {
        [key: number]: string;
    };
    status: string;
    reviewed_by: User;
    initiator: Initiator;
    type: string;
};

export type InitiatorDonation = {
    user: User;
    id: number;
    organization?: string;
    isVerified?: boolean;
    donationLimit?: number;
    donation_title?: string;
};

export type InitiatorBookDonation = {
    user: User;
    organization?: string;
    isVerified?: boolean;
    donationLimit?: number;
    donation_title?: string;
    book_type: string;
};

export type NominalDonation = {
    id: number;
    nominal: number;
};

export type Roles = {
    id: number;
    name: string;
};

export type UserRoles = {
    id: number;
    user: User;
    role: Roles;
};

export type News = {
    id: number;
    title: string;
    description: string;
    image: string;
};
