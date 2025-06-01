import { Input } from "@/Components/ui/input";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { useForm, Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import React from "react";

interface CreateAdminProps {
    auth: {
        user: User;
        roles: string;
    };
    // errors: Record<string, string>;
    // flash?: { // Flash might still be useful for general errors
    //     error?: string;
    //     errors?: Record<string, string>;
    // };
    [key: string]: any;
}

export default function CreateAdmin({ auth }: CreateAdminProps) {
    const page = usePage<CreateAdminProps>();
    const flash = page.props.flash; // Keep the flash prop for potential errors.

    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("super-admin.manage-users.create"), {
            onSuccess: () => {
                reset(); 
                alert("Submission succesful!");
                router.visit(route('super-admin.manage-users'));
            },
            onError: (formErrors) => {
                if (!flash?.error && !flash?.errors?.database) {
                    alert("Submission Error! Please check the form for errors.");
                }
                console.error("Form submission error:", formErrors);
            },
        });
    };

    return (
        <Authenticated>
            <Head title="Create Admin" />
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-2xl font-bold">Tambah Admin</h1>
                    {/* <Link href={route('super-admin.manage-users')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Back to User List
                    </Link> */}
                </div>
                <p className="text-lg">Masukkan informasi yang dibutuhkan dengan benar</p>
                <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-6 bg-white p-6">
                    {/* ... form fields ... */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        {/* <p className="text-xs text-gray-500 mb-2">
                            This will be used for login and display.
                        </p> */}
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={data.username}
                            onChange={(e) => setData("username", e.target.value)}
                            className={errors.username ? 'border-red-500' : ''}
                            required
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        {/* <p className="text-xs text-gray-500 mb-2">
                            This will be used for login and notifications.
                        </p> */}
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={errors.email ? 'border-red-500' : ''}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Minimum 8 characters.
                        </p> 
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            placeholder="Confirm new password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full mt-2">
                        {processing ? 'Creating...' : 'Create Admin'}
                    </Button>
                </form>
            </div>
        </Authenticated>
    );
}