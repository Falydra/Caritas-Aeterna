import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Donation, User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from "@/Components/ui/dropdown-menu";
import { FaRegEdit } from "react-icons/fa";
import { PiDotsThreeBold } from "react-icons/pi";
import { Button } from "@/Components/ui/button";

interface ManageDonationsProps {
    donations: {
        data: Donation[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    }
     auth: {
            user: User;
            roles: string;
        };
        [key: string]: any; 
}


export default function ManageDonations() {
    const { donations } = usePage<ManageDonationsProps>().props;
    
    

    

    return (
        <Authenticated>
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Donations Manager</h1>
                <p className="text-lg">Manage all donationss in the system.</p>
                <div className="flex flex-col w-full items-center justify-center">
                    <div className='w-full max-h-[375px] overflow-y-auto rounded-md '>
                        <table className="w-full text-center border rounded-full">
                            <thead className='p-8 bg-primary-bg border border-primary-fg bg-opacity-35'>
                                <tr className='p-8 bg-primary-accent/65  '>
                                    <th className='py-3 border-b border-primary-fg '>No</th>
                                    <th className='py-3 border-b border-primary-fg'>ID</th>
                                    <th className='py-3 border-b border-primary-fg'>Donation Title</th>
                                    <th className='py-3 border-b border-primary-fg'>Initiator Name</th>
                                    <th className='py-3 border-b border-primary-fg'>Donation Target</th>
                                    <th className='py-3 border-b border-primary-fg'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {donations.data.map((item, index) => (
                                    <tr key={item.id} className='text-center'>
                                        <td className='p-4 border-b'>{(donations.current_page - 1) * donations.per_page + index + 1}</td>
                                        <td className='p-4 border-b'>{item.id}</td>
                                        <td className='p-4 border-b'>{item.title}</td>
                                        <td className='p-4 border-b'>{item.initiator.username}</td>
                                        <td className='p-4 border-b'>{item.type_attributes.current_fund}</td>
                                        <td className='p-4 border-b '>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild className="w-full h-full">
                                                <Button className="w-8 h-8 aspect-square rounded-full " variant={"ghost"}>
                                                    <PiDotsThreeBold className="w-4 h-4 aspect-square self-center" />
                                                </Button>
                                                
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-48 mr-12">
                                                <DropdownMenuLabel>Account</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                    <Link  href={route("admin.manage-donations.edit", {id: item.id})} className="flex justify-between w-full h-8 items-center bg-transparent hover:bg-primary-accent/65 rounded-md text-primary-bg px-2 font-semibold text-sm ">
                                                        Edit
                                                    <FaRegEdit className="w-4 h-4 aspect-square " />
                                                    </Link>
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
                <div className=" flex justify-between items-center sticky bottom-0 z-9 w-full">
                     {donations.prev_page_url ? (
                        <Link
                            href={route("admin.manage-donations", { page: donations.current_page - 1 })}
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
                        Halaman {donations.current_page} dari {donations.last_page}
                    </span>
                    {donations.next_page_url ? (
                        <Link
                            href={route("admin.manage-donations", { page: donations.current_page + 1 })}
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
        </Authenticated>
    )
}