import { useForm, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";

interface ProfilePageProps {
    user: User;
    auth: { user: User; roles: string };
    [key: string]: any;
}

export default function Profile() {
    const { user } = usePage<ProfilePageProps>().props;
    const { data, setData, patch, processing, errors } = useForm({
        username: user.username || "",
        email: user.email || "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(route("admin.profile.update"));
    }

    return (
        <Authenticated>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
                <input
                    value={data.username}
                    onChange={e => setData("username", e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder="Username"
                />
                <input
                    value={data.email}
                    onChange={e => setData("email", e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder="Email"
                />
                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-accent text-white rounded-md">
                    Save Changes
                </button>
            </form>
        </Authenticated>
    );
}