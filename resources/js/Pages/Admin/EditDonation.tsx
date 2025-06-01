import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Donation, User } from "@/types";
import { usePage } from "@inertiajs/react";

interface EditDonationProps {
    donation: Donation;
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

export default function EditDonation() {
    const { donation } = usePage<EditDonationProps>().props;

    console.log("Editing Donation:", donation);
    
    return (
        <Authenticated>
            <div className="text-primary-fg p-8 w-full h-full items-start flex flex-col justify-start gap-2">
                <h1 className="text-2xl font-bold">Edit Donation</h1>
                <p className="text-sm text-primary-fg/50">
                    This page allows you to edit the details of a donation.
                </p>

                <div className="w-full max-w-2xl bg-primary-bg rounded-lg shadow-md">
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-primary-fg mb-2" htmlFor="title">
                                Donation Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                placeholder={donation.title}
                                className="w-full p-2 border border-primary-fg rounded-md bg-primary-bg text-primary-fg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-primary-fg mb-2" htmlFor="title">
                                Header Image
                            </label>
                           
                            <input
                                type="file"
                                id="headerImage"
                                accept="image/*"
                                className="w-full p-2 border border-primary-fg rounded-md bg-primary-bg text-primary-fg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-primary-fg mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder={donation.text_descriptions || ""}
                                className="w-full p-2 border border-primary-fg rounded-md bg-primary-bg text-primary-fg"
                            />
                            
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-primary-fg mb-2" htmlFor="targetAmount">
                                Target Amount
                            </label>
                            <input
                                type="number"
                                id="targetAmount"
                                defaultValue={donation.type_attributes.target_amount}
                                className="w-full p-2 border border-primary-fg rounded-md bg-primary-bg text-primary-fg"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-accent text-white rounded-md hover:bg-opacity-80 transition-colors"
                        >
                            Save Changes
                        </button>
                    </form>

                </div>
            </div>
        </Authenticated>
    )
}