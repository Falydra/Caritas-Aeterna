import { PersonInCharge } from "@/types";

const initiator_data: PersonInCharge[] = [
    {
        user: {
            id: 1,
            name: "John Doe",
            email: "john.@gmail.com",
            email_verified_at: "2025-01-01T00:00:00.000Z",
        },
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
        },
        organization: "Organisasi Papua Merdeka",
    },
];


export default initiator_data;