import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types"; // Assuming your User type is correctly defined
import { Button } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "@inertiajs/react";


interface UserColumnProps {
    onDelete: (userId: number) => void;
    // If you need other handlers, add them here
}

export const createColumns = ({ onDelete }: UserColumnProps): ColumnDef<User>[] => [
    {
        // This column displays the row number, not the actual user ID from the database
        // If you want the database ID, use:
        // accessorKey: "id",
        // header: "DB ID",
        id: "rowNumber", // Using a unique id as we are not using accessorKey directly for this
        header: "No.",
        cell: ({ row }) => row.index + 1, // Display 1-based row number
    },
    {
        accessorKey: "id",
        header: "ID",
        // cell: ({ row }) => row.index + 1, // Display row number instead of actual ID
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <PiDotsThreeBold className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route("super-admin.manage-users.edit", { id: user.id })} className="flex justify-between w-full items-center">
                                Edit Password
                                <FaRegEdit className="h-4 w-4" />
                            </Link>
                        </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(user.id!)} // Non-null assertion operator
                                className="text-red-600 focus:text-red-600 flex justify-between w-full items-center"
                            >
                                Delete
                                <FaTrashAlt className="h-4 w-4" />
                            </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];