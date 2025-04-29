import { Donation } from "@/types";

const donation_data: Donation[] = [
    {
        user: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            email_verified_at: "2025-01-01T00:00:00.000Z",
            role: "donor",
        },
        amount: 100000,
        username: "John Doe",
        
    },
    {
        user: {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            email_verified_at: "2025-01-02T00:00:00.000Z",
            role: "donor",
        },
        amount: 150000,
        username: "Jane Smith",
    },
    {
        user: {
            id: 3,
            name: "Alice Johnson",
            email: "alice@example.com",
            email_verified_at: "2025-01-03T00:00:00.000Z",
            role: "donor",
        },
        amount: 200000,
        username: "Alice Johnson",
    },
    {
        user: {
            id: 4,
            name: "Bob Brown",
            email: "bob@example.com",
            email_verified_at: "2025-01-04T00:00:00.000Z",
            role: "donor",
        },
        amount: 250000,
        username: "Bob Brown",
    },
    {
        user: {
            id: 5,
            name: "Charlie Davis",
            email: "charlie@example.com",
            email_verified_at: "2025-01-05T00:00:00.000Z",
            role: "donor",
        },
        amount: 300000,
        username: "Charlie Davis",
    },
    {
        amount: 350000,
        username: "Orang jahat"
    },
    {
        amount: 400000,
        username: "Orang baik"
    },
    {
        amount: 450000,
        username: "Orang jahat"
    },
    {
        amount: 500000,
        username: "Orang baik"
    },
    {
        amount: 550000,
        username: "Orang jahat"
    },
];

export default donation_data;