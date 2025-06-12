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
    order_id: string;
    donation_id: number;
    donor_donation_id: number;
    donation_type: string;
    amount: number;
    status: string;
    snap_token: string;
    redirect_url: string;

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
    books: Book[] | null;
    facilities: Facility[] | null;
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

export type UserProfile = {
    full_name: string;
    phone_number: string | null;
    date_of_birth: string | null;
    gender: string | null;
    profile_picture: string | null;
} | null;

export type UserIdentity = {
    nik: string;
    full_name: string;
    id_card_image: string | null;
    verified_at: string | null;
    address: Address;
}


export type Address = {
    address_detail: string | null;
    rt: string | null;
    rw: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    
} | null;


export type DoneeApplication = {
     id: number;
    donor_id: number;
    status: string;
}