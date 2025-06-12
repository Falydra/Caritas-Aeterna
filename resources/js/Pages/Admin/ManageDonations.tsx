import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Donation, User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/Components/ui/dropdown-menu";
import { FaRegEdit } from "react-icons/fa";
import { PiDotsThreeBold } from "react-icons/pi";
import { Button } from "@/Components/ui/button";
import React, { useState } from "react";
import axios from "axios";

interface ManageDonationsProps {
    donations: {
        data: Donation[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

export default function ManageDonations() {
    const { donations: initialDonations } =
        usePage<ManageDonationsProps>().props;


    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
        null
    );

    
    const [donations, setDonations] = useState(initialDonations);

   
    const handleStatusClick = (donation: Donation) => {
        setSelectedDonation(donation);
        setShowStatusModal(true);
    };
    

    
    const handleStatusChange = async (status: "on_progress" | "denied") => {
        if (!selectedDonation) return;
        try {
            await axios.post(route("admin.manage-donations.set-status"), {
                id: selectedDonation.id,
                status,
            });
            setDonations((prev) => ({
                ...prev,
                data: prev.data.map((item) =>
                    item.id === selectedDonation.id ? { ...item, status } : item
                ),
            }));
        } catch (e) {
            alert("Gagal mengubah status");
        }
        setShowStatusModal(false);
        setSelectedDonation(null);
    };

    return (
        <Authenticated>
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Donations Manager</h1>
                <p className="text-lg">Manage all donationss in the system.</p>
                <div className="flex flex-col w-full items-center justify-center">

                    <div className="w-full max-h-[375px] overflow-y-auto rounded-md ">
                       
                    <div className='w-full max-h-[325px] overflow-y-auto rounded-md '>
                        <table className="w-full text-center border rounded-full">
                            <thead className='p-8 bg-primary-bg border border-primary-fg bg-opacity-35'>
                                <tr className='p-8 bg-primary-accent/65  '>
                                    <th className='py-3 border-b border-primary-fg'>No</th>
                                    <th className='py-3 border-b border-primary-fg'>ID</th>
                                    <th className='py-3 border-b border-primary-fg'>Donation Title</th>
                                    <th className='py-3 border-b border-primary-fg'>Initiator Name</th>
                                    <th className='py-3 border-b border-primary-fg'>Donation Target</th>
                                    <th className='py-3 border-b border-primary-fg'>Status</th> 
                                    <th className='py-3 border-b border-primary-fg'>Actions</th>

                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {donations.data.map((item, index) => (
                                    <tr key={item.id} className="text-center">
                                        <td className="p-4 border-b">
                                            {(donations.current_page - 1) *
                                                donations.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td className="p-4 border-b">
                                            {item.id}
                                        </td>
                                        <td className="p-4 border-b">
                                            {item.title}
                                        </td>
                                        <td className="p-4 border-b">
                                            {item.initiator.username}
                                        </td>

                                        <td className="p-4 border-b">
                                            {item.type ===
                                            "App\\Models\\ProductDonation"
                                                ? item.type_attributes
                                                      .product_amount
                                                : item.type ===
                                                  "App\\Models\\Fundraiser"
                                                ? item.type_attributes
                                                      .target_fund
                                                : "-"}
                                        </td>
                                        <td className="p-4 border-b">
                                            {item.status === "on_progress" ? (
                                                <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                                                    On Progress
                                                </span>
                                            ) : item.status === "denied" ? (
                                                <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                                                    Denied
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-gray-400 text-white text-xs font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 border-b ">
                                            <DropdownMenu>
                                                
                                                        <DropdownMenuTrigger
                                                            asChild
                                                            className="w-full h-full"
                                                        >
                                                            <Button
                                                                className="w-8 h-8 aspect-square rounded-full "
                                                                variant={
                                                                    "ghost"
                                                                }
                                                            >
                                                                <PiDotsThreeBold className="w-4 h-4 aspect-square self-center" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-48 mr-12">
                                                            <DropdownMenuLabel>
                                                                Account
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link
                                                                    href={route(
                                                                        "admin.manage-donations.edit",
                                                                        {
                                                                            id: item.id,
                                                                        }
                                                                    )}
                                                                    className="flex justify-between w-full h-8 items-center bg-transparent hover:bg-primary-accent/65 rounded-md text-primary-bg px-2 font-semibold text-sm "
                                                                >
                                                                    Edit
                                                                    <FaRegEdit className="w-4 h-4 aspect-square " />
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusClick(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="flex justify-between w-full h-8 items-center bg-transparent hover:bg-primary-accent/65 rounded-md text-primary-bg px-2 font-semibold text-sm"
                                                                >
                                                                    Status
                                                                </button>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                               
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className=" flex justify-between items-center sticky pt-4 bottom-0 z-9 w-full">
                    {donations.prev_page_url ? (
                        <Link
                            href={route("admin.manage-donations", {
                                page: donations.current_page - 1,
                            })}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="px-4 py-2 bg-gray-300 text-white rounded cursor-not-allowed">
                            Previous
                        </span>
                    )}
                    <span>
                        Halaman {donations.current_page} dari{" "}
                        {donations.last_page}
                    </span>
                    {donations.next_page_url ? (
                        <Link
                            href={route("admin.manage-donations", {
                                page: donations.current_page + 1,
                            })}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="px-4 py-2 bg-gray-300 text-white rounded cursor-not-allowed">
                            Next
                        </span>
                    )}
                </div>
            </div>
         
            {showStatusModal && selectedDonation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-6 min-w-[300px] text-black">
                        <h2 className="text-lg font-bold mb-4">
                            Ubah Status Donasi
                        </h2>
                        <p className="mb-4">
                            Setujui atau tolak donasi{" "}
                            <span className="font-semibold">
                                {selectedDonation.title}
                            </span>
                            ?
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() =>
                                    handleStatusChange("on_progress")
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleStatusChange("denied")}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </div>
        </Authenticated>

    );
}
