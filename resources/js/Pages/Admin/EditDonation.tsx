import { useForm, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Donation, User } from "@/types";

interface EditDonationProps {
    donation: Donation;
    auth: { user: User; roles: string };
    [key: string]: any;
}

export default function EditDonation() {
    const { donation } = usePage<EditDonationProps>().props;
    const { data, setData, patch, processing, errors } = useForm({
        title: donation.title || "",
        header_image: donation.header_image || "",
        text_description: Array.isArray(donation.text_descriptions)
        ? donation.text_descriptions.join("\n")
        : typeof donation.text_descriptions === "object"
            ? Object.values(donation.text_descriptions).join("\n")
            : donation.text_descriptions || "",
        image_description: donation.image_descriptions || "",
        target_amount: donation.type_attributes?.target_amount || "",


    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        patch(route("admin.manage-donations.update", { id: donation.id }));
    }

    return (
        <Authenticated>
             <div className="flex w-full flex-col max-h-screen items-center justify-center p-8 bg-primary-bg gap-4">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <p className="text-lg">Modify user details below.</p>
                <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg shadow-md flex flex-col gap-8">
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData("title", e.target.value)}
                            className="w-full p-2 border bg-transparent rounded-md mb-2"
                            placeholder="Donation Title"
                        />
                        {errors.title && <div className="text-red-500">{errors.title}</div>}
                    </div>
                    <div>
                        <label>Header Image URL</label>
                        <input
                            type="text"
                            value={data.header_image}
                            onChange={e => setData("header_image", e.target.value)}
                            className="w-full p-2 border bg-transparent rounded-md mb-2"
                            placeholder="Header Image URL"
                        />
                        {errors.header_image && <div className="text-red-500">{errors.header_image}</div>}
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            value={data.text_description}
                            onChange={e => setData("text_description", e.target.value)}
                            className="w-full p-2 border bg-transparent rounded-md mb-2"
                            placeholder="Donation Description"
                        />
                        {errors.text_description && <div className="text-red-500">{errors.text_description}</div>}
                    </div>

                    <div>
                        <label>Target Amount</label>
                        <input
                            type="number"
                            value={data.target_amount}
                            onChange={e => setData("target_amount", e.target.value)}
                            className="w-full p-2 border bg-transparent rounded-md mb-2"
                            placeholder="Target Amount"
                        />
                        {errors.target_amount && <div className="text-red-500">{errors.target_amount}</div>}
                    </div>
                    {/* Add more fields as necessary */}
                    <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-accent text-white rounded-md">
                        Save Changes
                    </button>   
                   
                </form>
            </div>
        </Authenticated>
    );
}