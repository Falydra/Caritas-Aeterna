import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from "@/Components/ui/dropdown-menu";
import { IoIosLogOut } from "react-icons/io";
import { Button } from "@/Components/ui/button";
import { PiDotsThreeBold } from "react-icons/pi";




interface SuperAdminDashboardProps {
    user: {
        data: User[];
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


export default function ManageUsers() {
    const { user } = usePage<SuperAdminDashboardProps>().props;
    const [showModal, setShowModal] = useState(false);

    
    return (
        <Authenticated>
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">User Manager</h1>
                <p className="text-lg">Manage all users in the system.</p>
                <div className="flex flex-col w-full items-center justify-center">
                    <div className='w-full max-h-[375px] overflow-y-auto rounded-md '>
                        <table className="w-full text-center border rounded-full">
                            <thead className='p-8 bg-primary-bg border border-primary-fg bg-opacity-35'>
                                <tr className='p-8 bg-primary-accent/50  '>
                                    <th className='py-3 border-b border-primary-fg '>No</th>
                                    <th className='py-3 border-b border-primary-fg'>ID</th>
                                    <th className='py-3 border-b border-primary-fg'>Username</th>
                                    <th className='py-3 border-b border-primary-fg'>Email</th>
                                    <th className='py-3 border-b border-primary-fg'>Role</th>
                                    <th className='py-3 border-b border-primary-fg'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {user.data.map((item, index) => (
                                    <tr key={item.id} className='text-center'>
                                        <td className='p-4 border-b'>{(user.current_page - 1) * user.per_page + index + 1}</td>
                                        <td className='p-4 border-b'>{item.id}</td>
                                        <td className='p-4 border-b'>{item.username}</td>
                                        <td className='p-4 border-b'>{item.email}</td>
                                        <td className='p-4 border-b'>{item.role}</td>
                                        <td className='p-4 border-b '>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild className="w-full h-full">
                                                <Button className="w-8 h-8 aspect-square rounded-full" variant={"ghost"}>
                                                    <PiDotsThreeBold className="w-4 h-4 aspect-square self-center" />
                                                </Button>
                                                
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-48 mr-12">
                                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                    <Link  href={route("super-admin.manage-users.edit", {id: item.id})} className="flex justify-between w-full h-8 items-center bg-transparent hover:bg-primary-accent/65 rounded-md text-primary-bg px-2 font-semibold text-sm ">
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
                    <Link
                        href={route("super-admin.dashboard", { page: user.prev_page_url ? user.current_page - 1 : user.current_page })}
                        disabled={!user.prev_page_url}
                        className={`px-4 py-2 ${user.prev_page_url ? 'bg-blue-500' : 'bg-primary-accent'} text-white rounded`}
                    >
                        Previous
                    </Link>
                    <span>
                        Halaman {user.current_page} dari {user.last_page}
                    </span>
                    <Link
                        href={route("super-admin.dashboard", { page: user.next_page_url ? user.current_page + 1 : user.current_page })}
                        disabled={!user.next_page_url}
                        className={`px-4 py-2 ${user.next_page_url ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded`}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </Authenticated>
    );
}