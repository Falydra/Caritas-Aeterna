import { Input } from "@/Components/ui/input";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { useForm, usePage, Head, Link as InertiaLink, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

interface EditUserProps {
    user: User;
    auth: {
        user: User;
        roles: string;
    };
    errors: Record<string, string>;
    [key: string]: any;
}

export default function EditUser() {
    const { user: adminUserToEdit, errors: initialErrors, auth } = usePage<EditUserProps>().props;

    const { data, setData, put, processing, errors, reset } = useForm({
        id: adminUserToEdit.id,
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("super-admin.manage-users.edit"), {
            onSuccess: () => {
                alert("Edit succesful!");
                reset("current_password", "new_password", "new_password_confirmation");
                router.visit(route('super-admin.manage-users'));
            },
            onError: (formErrors) => {
                console.error("Form submission error:", formErrors);
            },
        });
    };

    return (
        <Authenticated>
            <Head title={`Change Password - ${adminUserToEdit.username}`} />
            <div className="flex w-full flex-col max-h-screen items-start justify-start px-8 py-4 bg-primary-bg gap-4">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-2xl font-bold">Change Password for Admin: {adminUserToEdit.username}</h1>
                    <InertiaLink
                        href={route('super-admin.manage-users')}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back to User List
                    </InertiaLink>
                </div>
                <p className="text-lg">
                    Current Admin: <span className="font-semibold">{adminUserToEdit.username}</span> (ID: {adminUserToEdit.id}, Email: {adminUserToEdit.email})
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-6 bg-white p-6">
                    <div className="mb-2">
                        <Label className="block text-sm font-medium text-gray-700">Username</Label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{adminUserToEdit.username}</p>
                    </div>
                    <div className="mb-2">
                        <Label className="block text-sm font-medium text-gray-700">Email</Label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{adminUserToEdit.email}</p>
                    </div>

                    <hr className="my-2" />

                    <div>
                        <Label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password Saat Ini
                        </Label>
                        {/* <p className="text-xs text-gray-500 mb-2">
                            Required by the system to verify your action.
                        </p> */}
                        <Input
                            id="current_password"
                            type="password"
                            placeholder="Enter your current password"
                            value={data.current_password}
                            onChange={(e) => setData("current_password", e.target.value)}
                            className={errors.current_password ? 'border-red-500' : ''}
                            required
                        />
                        {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                    </div>

                    <div>
                        <Label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                            Admin's New Password
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                            Minimum 8 characters.
                        </p>
                        <Input
                            id="new_password"
                            type="password"
                            placeholder="Enter new password for admin"
                            value={data.new_password}
                            onChange={(e) => setData("new_password", e.target.value)}
                            className={errors.new_password ? 'border-red-500' : ''}
                            required
                        />
                        {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>}
                    </div>

                    <div>
                        <Label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Admin's New Password
                        </Label>
                        <Input
                            id="new_password_confirmation"
                            type="password"
                            placeholder="Confirm new password"
                            value={data.new_password_confirmation}
                            onChange={(e) => setData("new_password_confirmation", e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full mt-2">
                        {processing ? 'Updating Password...' : 'Update Admin Password'}
                    </Button>
                </form>
            </div>
        </Authenticated>
    );
}
