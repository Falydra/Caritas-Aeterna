import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { usePage, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { createColumns } from "./user_column";
import { DataTable } from "@/Components/ui/data-table";

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

    const handleDeleteUser = (userIdToDelete: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(
                route("super-admin.manage-users.destroy", { id: userIdToDelete }),
                {
                    data: { id: userIdToDelete },
                    preserveScroll: true,
                    onSuccess: () => {
                    },
                    onError: (errors) => {
                        let errorMessage = "An error occurred during deletion.";
                        if (errors && errors.id) {
                            errorMessage = errors.id;
                        } else if (errors && errors.database) {
                            errorMessage = errors.database;
                        } else if (errors && Object.keys(errors).length > 0) {
                            errorMessage = `Error: ${Object.values(errors).join(", ")}`;
                        }
                        alert(errorMessage);
                        console.error("Deletion error:", errors);
                    },
                }
            );
        }
    };

    const columns = createColumns({
        onDelete: handleDeleteUser,
    });

    return (
        <Authenticated>
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-2xl font-bold">Manage Users</h1>    
                    {/* <p className="text-lg">Manage all admin users in the system.</p> */}
                    <Link
                        href={route("super-admin.manage-users.create")}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Tambah Admin
                    </Link>
                </div>
                <div className="flex flex-col w-full items-center justify-center">
                    <div className='w-full rounded-md '>
                        <DataTable columns={columns} data={user.data} />
                    </div>
                </div>
                <div className="flex justify-between items-center sticky bottom-0 z-9 w-full mt-4">

                    {user.prev_page_url ? (
                        <Link
                            href={route("super-admin.manage-users", { page: user.current_page - 1 })}
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
                        Halaman {user.current_page} dari {user.last_page}
                    </span>

                    {user.next_page_url ? (
                        <Link
                            href={route("super-admin.manage-users", { page: user.current_page + 1 })}
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
