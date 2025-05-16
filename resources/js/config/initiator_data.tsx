import { InitiatorDonation } from "@/types";

const initiator_data: InitiatorDonation[] = [
    {
        user: {
            id: 1,
            name: "John Doe",
            email: "john.@gmail.com",
            email_verified_at: "2025-01-01T00:00:00.000Z",
            role: "donee",
        },
        id: 1,
        organization: "Organisasi Papua Merdeka",
        donationLimit: 10000000,
        donation_title: "Bantu Programmer Papua",
    },
    {
        user: {
            id: 2,
            name: "Jane Smith",
            email: "janee.@gmail.com",
            email_verified_at: "2025-01-02T00:00:00.000Z",
            role: "donee",
        },
        id: 2,
        organization: "Organisasi Papua Merdeka",
        donationLimit: 10000000,
        donation_title: "Bantu Programmer Papua",
    },
    {
        user: {
            id: 2,
            name: "Prabowo Smith",
            email: "prabowo.@gmail.com",
            email_verified_at: "2025-01-02T00:00:00.000Z",
            role: "donee",
        },
        id: 3,
        organization: "Organisasi Perwakilan Rakyat",
        donationLimit: 10000000,
        donation_title: "Bantu Programmer Papua",
    },
];

export default initiator_data;
