import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { PageProps, User } from "@/types";
import { Inertia } from "@inertiajs/inertia";

export default function CreateDonationForm() {
    const [data, setData] = useState({
        type: "",
        title: "",
        description: "",
        header_image: "",
    });

    // fundraiser attribute
    const [fundraiser, setFundraiser] = useState({
        targetFund: 0,
    });

    // product donation attribute
    const [productDonation, setProductDonation] = useState({
        item_amount: "",
    });
    const [existingBook, setExistingBook] = useState([]);
    const [newBook, setNewBook] = useState({
        title: "",
        isbn: "",
        authors: [],
        published_year: "",
        synopsis: "",
        price: "",
    });

    useEffect(() => {
        console.log("Data:", data);
    }, [data]);

    interface CreateDonationProps extends PageProps {
        auth: {
            user: User;
            roles: string;
        };
        donationStoreUrl: string;
    }

    const { auth, donationStoreUrl } = usePage<CreateDonationProps>().props;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            type: data.type,
            title: data.title,
            description: data.description,
            header_image: data.header_image,
        };

        const res = await router.post(donationStoreUrl, payload, {
            onSuccess: () => {
                console.log("Success");
            },
            onError: (err) => {
                console.log("Error: ", err);
            },
        });
    };

    return (
        <div className="flex flex-col gap-8 m-8">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 capitalize w-1/4"
            >
                <h1 className="w-full text-center text-3xl">
                    Buat Donasi Baru
                </h1>
                <label htmlFor="title" className="flex flex-col gap-1">
                    judul:
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={data.title}
                        onChange={(e) =>
                            setData({ ...data, title: e.target.value })
                        }
                        className="text-black p-2"
                    />
                </label>
                <label htmlFor="description" className="flex flex-col gap-1">
                    deskripsi:
                    <textarea
                        name="description"
                        id="description"
                        cols={50}
                        rows={5}
                        placeholder="Deskripsi maksimal 2048 karakter"
                        className="text-black p-2"
                        value={data.description}
                        onChange={(e) =>
                            setData({ ...data, description: e.target.value })
                        }
                    ></textarea>
                </label>
                <label htmlFor="header_image" className="flex flex-col gap-1">
                    gambar:
                    <input
                        type="text"
                        name="header_image"
                        id="header_image"
                        value={data.header_image}
                        onChange={(e) =>
                            setData({ ...data, header_image: e.target.value })
                        }
                        className="text-black p-2"
                    />
                </label>
                <label htmlFor="type" className="flex flex-col gap-1">
                    jenis:
                    <select
                        name="type"
                        id="type"
                        className="text-black p-2"
                        value={data.type}
                        onChange={(e) =>
                            setData({ ...data, type: e.target.value })
                        }
                        required
                    >
                        <option value="" disabled selected>
                            --- pilih jenis donasi ----
                        </option>
                        <option value="fundraiser">donasi uang</option>
                        <option value="product_donation">donasi barang</option>
                    </select>
                </label>
                <button
                    type="submit"
                    className="bg-white text-black active:bg-gray-300 p-2 duration-150 transition-colors"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
