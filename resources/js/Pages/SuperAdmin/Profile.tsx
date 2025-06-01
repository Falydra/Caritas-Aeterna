import { Input } from "@/Components/ui/input";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

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
    return (
        <Authenticated>
            <div className="flex w-full flex-col items-start justify-start p-8 bg-primary-bg gap-4">
                <div className="flex w-full flex-col items-start justify-start">

                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-lg text-opacity-50 text-primary-fg">
                    Halaman ini menampilkan informasi profil pengguna yang sedang masuk.
                </p>
                </div>
                <label>
                    <h1 className="text-lg">Username</h1>
                    <p className="text-sm text-primary-fg text-opacity-50">
                        Username ini digunakan untuk login ke sistem.
                    </p>
                </label>
                <Input
                    placeholder={user.username + " (current username)"}
                    className="w-full focus:text-primary-fg text-primary-fg"
                />
                <label>
                    <h1 className="text-lg">Email</h1>
                    <p className="text-sm text-primary-fg text-opacity-50">
                        Email ini digunakan untuk mengirimkan notifikasi dan informasi penting.
                    </p>
                </label>
                <Input
                    placeholder={user.email + " (current username)"}
                    className="w-full focus:text-primary-fg text-primary-fg"
                />
                <Link
                href={route("super-admin.profile.update")}
                className="bg-primary-accent w-2/12 h-[35px] rounded-md self-end bottom-8 absolute text-primary-fg font-semibold items-center flex justify-center "
                >
                <span className="text-center text-sm">Update Profile</span>
                </Link>
                
            </div>
        </Authenticated>
    )
}