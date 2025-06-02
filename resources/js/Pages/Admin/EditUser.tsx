import { useForm, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { Input } from "@/Components/ui/input";

interface EditUserProps {
    user: User;
    auth: { user: User; roles: string };
    [key: string]: any;
}

export default function EditUser() {
    const { user } = usePage<EditUserProps>().props;
    const { data, setData, patch, processing, errors } = useForm({
        username: user.username || "",
        email: user.email || "",
        password: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(route("admin.manage-users.update", { id: user.id }));
    }

    return (
        <Authenticated>
             <div className="flex w-full flex-col max-h-screen items-center justify-center p-8 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <p className="text-lg">Modify user details below.</p>
                <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-8">
                    <div>
                        <label>Username</label>
                        <Input
                            value={data.username}
                            placeholder="Enter username"
                            onChange={e => setData("username", e.target.value)}
                            className="text-primary-fg focus:text-primary-fg"
                        />
                        {errors.username && <div className="text-red-500">{errors.username}</div>}
                    </div>
                    <div>
                        <label>Email</label>
                        <Input
                            value={data.email}
                            onChange={e => setData("email", e.target.value)}
                            className="text-primary-fg focus:text-primary-fg"
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>
                    <div>
                        <label>Password</label>
                        <Input
                            type="password"
                            value={data.password}
                            onChange={e => setData("password", e.target.value)}
                            placeholder="Enter new password"
                            className="text-primary-fg focus:text-primary-fg"
                        />
                        {errors.password && <div className="text-red-500">{errors.password}</div>}
                    </div>
                    <button type="submit" disabled={processing} className="bg-primary-accent text-white rounded px-4 py-2 mt-4">
                        Update User
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}