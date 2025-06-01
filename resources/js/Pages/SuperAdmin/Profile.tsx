import { Input } from "@/Components/ui/input";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

interface ProfilePageProps {
    user: User;
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

export default function Profile() {
    const { user } = usePage<ProfilePageProps>().props;

    console.log("User Profile", user);
    const { data, setData, patch, processing, errors } = useForm({
        username: user.username || "",
        email: user.email || "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(route("super-admin.profile.update"));
    }

    return (
        <Authenticated>
            <div className="flex w-full flex-col items-center justify-center p-8 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <p className="text-lg">Modify user details below.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-1/2">
                    <label>
                        <h1 className="text-lg">Username</h1>
                        <Input
                            value={data.username}
                            onChange={e => setData("username", e.target.value)}
                            placeholder="Enter username"
                            className="text-primary-fg focus:text-primary-fg"
                        />
                        {errors.username && <div className="text-red-500">{errors.username}</div>}
                    </label>
                    <label>
                        <h1 className="text-lg">Email</h1>
                        <Input
                            value={data.email}
                            onChange={e => setData("email", e.target.value)}
                            placeholder="Enter email"
                            className="text-primary-fg focus:text-primary-fg"
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </label>
                    <button type="submit" disabled={processing} className="bg-primary-accent w-2/12 h-[35px] rounded-md self-end text-primary-fg font-semibold flex justify-center items-center">
                        Save
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}