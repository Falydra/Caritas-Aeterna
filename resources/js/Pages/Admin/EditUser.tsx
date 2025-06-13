import { useForm, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

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
            {/* <Head title="Edit User" /> */}
            <div className="flex w-full justify-center items-center pt-8 bg-primary-bg text-white">
                <div className="flex flex-col w-1/2 items-start self-center gap-4 px-8 py-4">
                    <div className="flex flex-col items-start w-full gap-1">
                        <h1 className="text-2xl font-bold self-center">Edit User</h1>
                        <p className="text-lg self-center">Modify user details below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full rounded-lg shadow-md flex flex-col gap-6 bg-primary-bg p-6 border border-white">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={data.username}
                                onChange={(e) => setData("username", e.target.value)}
                                className={`text-primary-fg focus:text-primary-fg ${errors.username ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={`text-primary-fg focus:text-primary-fg ${errors.email ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                                Password
                            </label>
                            <p className="text-xs text-gray-500 mb-2">Enter a new password (leave blank to keep current).</p>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={`text-primary-fg focus:text-primary-fg ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full mt-2 bg-primary-accent">
                            {processing ? 'Updating...' : 'Update User'}
                        </Button>
                    </form>
                </div>
            </div>
        </Authenticated>
    );

}