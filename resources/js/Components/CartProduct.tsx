// filepath: c:\Users\user hp2\Documents\Project\PKL\SiMiskin\SiMiskin\resources\js\Components\CartProduct.tsx
import { useEffect, useState } from "react";
import { Payment, columns } from "@/config/cart_data";
import DataTable  from "@/config/data_cart_table";

async function getData(): Promise<Payment[]> {
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        
    ];
}

export default function CartProduct() {
    const [data, setData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getData();
            setData(result);
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex w-full h-full text-primary-bg">
            <DataTable />
        </div>
    );
}