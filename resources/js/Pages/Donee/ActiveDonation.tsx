import { useState } from "react";
import { usePage, Link } from "@inertiajs/react"; // Removed 'router' as it's not directly used in this render
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Donation, PageProps as InertiaPageProps, User } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { FaRegEdit, FaListUl, FaEye, FaPlus } from "react-icons/fa"; // Added FaPlus
import { PiDotsThreeBold } from "react-icons/pi";


interface ActiveDonationPageProps{
    donations: {
        data: Donation[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    },
    auth: {
        user: User;
        roles: string;
    },
    [key: string]: any;
}


function formatClassName(className: string): string {
    if (!className) return "N/A";
    const parts = className.split("\\");
    const modelName = parts[parts.length - 1];
    return modelName.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
}

// Adjusted to use text-based status for better flexibility with custom theme colors
function getStatusChipClasses(status: string): string {
    const s = status?.toLowerCase();
    // These would ideally map to your theme's color definitions
    // For example, if bg-green-100 text-green-700 is your "success"
    if (s === "finished") {
        return "bg-green-500 text-white"; // Example: success
    }
    if (s === "active" || s === "open" || s === "ongoing") {
        return "bg-blue-500 text-white"; // Example: active/info
    }
    if (s === "pending") {
        return "bg-yellow-500 text-white"; // Example: warning
    }
    return "bg-gray-500 text-white"; // Example: default
}


export default function DoneeActiveDonation() {
    const { auth, donations } = usePage<ActiveDonationPageProps>().props;

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const isAllSelected = donations.data.length > 0 && selectedIds.length === donations.data.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(donations.data.map(row => row.id).filter((id): id is number => typeof id === 'number'));
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <Authenticated>
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Donasi Dibuka</h1>
                <p className="text-lg">Manage Semua Donasi yang dibuka.</p>
                <div className="flex flex-col w-full items-center justify-center">
                    <table className="w-full text-center border rounded-full">
                        <thead className='p-8 bg-primary-bg border border-primary-fg bg-opacity-35'>
                                <tr className='p-8 bg-primary-accent/65  '>
                                    <th className='py-3 border-b border-primary-fg'>No</th>
                                    <th className='py-3 border-b border-primary-fg'>Judul</th>
                                    <th className='py-3 border-b border-primary-fg'>Jenis</th>
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
                                        {item.title}
                                    </td>
                                    <td className="p-4 border-b">
                                        {formatClassName(item.type)}
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
                                    <td className="p-4 border-b">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-8 h-8 p-0"> {/* Adjusted to ghost and size */}
                                                    <PiDotsThreeBold className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="end"> {/* Added align="end" */}
                                                <DropdownMenuLabel>Quick Action</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('donee.donations.donatedItem', { donation: item.id })} className="flex items-center">
                                                            <FaListUl className="mr-2 h-4 w-4" />
                                                            <span>Daftar Sumbangan</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        {/* Using standard <a> for new tab, or Inertia <Link> for same tab */}
                                                        <a href={`/donations/${item.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                            <FaEye className="mr-2 h-4 w-4" />
                                                            <span>Detail Donasi</span>
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route("donee.donations.edit", { id: item.id })} className="flex items-center">
                                                            <FaRegEdit className="mr-2 h-4 w-4" />
                                                            <span>Edit Donasi</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className=" flex justify-between items-center sticky pt-4 bottom-0 z-9 w-full">
                    {donations.prev_page_url ? (
                        <Link
                            href={route("donee.donations.index", {
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
                            href={route("donee.donations.index", {
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
        </Authenticated>
    );
}