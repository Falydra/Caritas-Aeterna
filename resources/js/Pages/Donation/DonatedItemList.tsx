import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Button, capitalize, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";

const BackButton = styled(Button)(({ theme }) => ({
    color: grey['A200'],
    textTransform: 'capitalize'
}));

interface Fund {
    id: number,
    order_id: string
    amount: string,
    status: string,
    updated_at: string
}

interface DonationItem {
    id: number,
    product_amount: number,
    package_picture: string,
    resi: string,
    updated_at: string
}

interface DonorDonation {
    id: number,
    donation_id: number
}

interface Data {
    id: number,
    type: string,
    title: string
}

export default function DonatedItemList() {
    const handleBack = () => {
        Inertia.visit('/dashboard/donee');
    };

    return (
        <Authenticated>
            <div className="flex flex-col px-8 py-8 gap-4 w-full">
                <div>
                    <BackButton startIcon={(
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    )} LinkComponent="a" href="/dashboard/donee">Kembali</BackButton>
                </div>
                <div className="flex flex-col px-4 gap-4 w-full">
                    <h2 className="text-primary-fg text-2xl font-bold self-start">
                        Daftar Sumbangan
                    </h2>
                </div>
            </div>
        </Authenticated>
    );
}
