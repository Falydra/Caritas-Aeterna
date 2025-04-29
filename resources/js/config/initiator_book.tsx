import { InitiatorBookDonation } from "@/types";

const initiator_book_data: InitiatorBookDonation[] = [
    {
        user: {
            id: 1,
            name: "John Doe",
            email: "john.@gmail.com",
            email_verified_at: "2025-01-01T00:00:00.000Z",
            role: "donee",
        },
        organization: "Universitas Papua Merdeka",
        donationLimit: 100,
        donation_title: "Bantu Programmer Papua",
        book_type: "Kalkulus",
    },
    {
        user: {
            id: 2,
            name: "Jane Smith",
            email: "janee.@gmail.com",
            email_verified_at: "2025-01-02T00:00:00.000Z",
            role: "donee",
        },
        organization: "Universitas Papua Merdeka",
        donationLimit: 10000000,
        donation_title: "Bantu Programmer Papua",
        book_type: "Non-Fiksi",
    },
    {
        user: {
            id: 3,
            name: "Prabowo Smith",
            email: "prabowo.@gmail.com",
            email_verified_at: "2025-01-02T00:00:00.000Z",
            role: "donee",
        },
        organization: "Universitas Perwakilan Rakyat",
        donationLimit: 10000000,
        donation_title: "Bantu Programmer Papua",
        book_type: "Fiksi",
    },
];

export default initiator_book_data;