import { Input } from "@/Components/ui/input";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";

interface editUserProps {
    user: User;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: any;
}

export default function EditUser() {
    const { user } = usePage<editUserProps>().props;

    console.log("Users", user)

    return (
        <Authenticated>
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <p className="text-lg">Modify user details below.</p>
                <form className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-8">
                    <div>

                        <label>
                            Username
                        </label>
                        <p className="text-sm text-gray-500 mb-2">
                            This will be used for login and display.
                        </p>
                        <Input
                        placeholder={user.username}
                        >
                        </Input>

                    </div>

                    <div>
                        <label>
                            Email
                        </label>
                        <p className="text-sm text-gray-500 mb-2">
                            This will be used for login and notifications.
                        </p>

                        <Input
                        placeholder={user.email}
                        >

                        </Input>

                    </div>


                    <div>

                        <label>
                            Password
                        </label>
                        <p className="text-sm text-gray-500 mb-2">
                            Leave blank to keep the current password.
                        </p>
                        <Input
                        
                        placeholder="Enter new password"
                        >

                        </Input>
                    </div>
                </form>

                
                
            </div>
        </Authenticated>
    )
}