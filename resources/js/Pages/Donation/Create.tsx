import React, { useState } from "react";
import DynamicTextDescription from "./DynamicTextDescription";
import AddTextDescriptionButton from "./AddTextDescriptionButton";
import AddImageDescriptionButton from "./AddImageDescriptionButton";
import DynamicImageDescription from "./DynamicImageDescription";
import { router, usePage } from "@inertiajs/react";
import { PageProps, User } from "@/types";

export default function CreateDonation() {
    // donation data
    const [data, setData] = useState({
        type: "",
        title: "",
    });

    // header image
    const [headerImage, setHeaderImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState("");
    const handleHeaderImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setHeaderImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // fundraiser attributes
    const [fundraiserAttr, setFundraiserAttr] = useState({
        target_fund: "",
    });

    // product donation attributes
    const [productDonationAttr, setProductDonationAttr] = useState({
        product_amount: "",
    });

    // handle type change
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({ ...data, type: e.target.value });
        if (e.target.value === "fundraiser") {
            setFundraiserAttr({
                ...fundraiserAttr,
                target_fund: "10000000",
            });
        } else {
            setProductDonationAttr({
                ...productDonationAttr,
                product_amount: "10",
            });
        }
    };

    // const [descriptions, setDescriptions] = useState([{ value: "" }]);
    const [descriptions, setDescriptions] = useState<
        { value: string | File }[]
    >([{ value: "" }]);

    // update text description field
    const handleTextDescriptionChange = (
        index: any,
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const values = [...descriptions];
        values[index].value = e.target.value;
        setDescriptions(values);
    };

    // upadate image description field
    const handleImageDescriptionChange = (
        index: any,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const values = [...descriptions];
        values[index].value = e.target.value;
        setDescriptions(values);
    };

    // add new text description
    const handleAddTextDescription = () => {
        setDescriptions([...descriptions, { value: "" }]);
    };

    // add new image description
    const handleAddImageDescription = (file: File) => {
        setDescriptions((prev) => [...prev, { value: file }]);
    };

    // remove input fields
    const handleRemoveFields = (index: any) => {
        const newDescriptions = [...descriptions];
        newDescriptions.splice(index, 1);
        setDescriptions(newDescriptions);
    };

    // handle submit
    interface CreateDonationProps extends PageProps {
        auth: {
            user: User;
            roles: string;
        };
        donationStoreUrl: string;
    }
    const { auth, donationStoreUrl } = usePage<CreateDonationProps>().props;

    const handleSubmit = async () => {
        const payload = new FormData();

        payload.append("data[type]", data.type);
        payload.append("data[title]", data.title);

        if (headerImage) {
            payload.append("data[header_image]", headerImage);
        }

        // append descriptions
        descriptions.forEach((description, index) => {
            if (typeof description.value === "string") {
                payload.append(
                    "data[text_descriptions][" + index + "]",
                    description.value
                );
            } else if (description.value instanceof File) {
                payload.append(
                    "data[image_descriptions][" + index + "]",
                    description.value
                );
            }
        });

        // append type attributes
        if (data.type === "fundraiser") {
            payload.append(
                "data[type_attributes][target_fund]",
                fundraiserAttr.target_fund.toString()
            );
        } else {
            payload.append(
                "data[type_attributes][product_amount]",
                productDonationAttr.product_amount.toString()
            );
        }

        await router.post(donationStoreUrl, payload, {
            onSuccess: () => {
                console.log("Success");
            },
            onError: (err) => {
                console.log("Error: ", err);
            },
        });
    };

    return (
        <div className="bg-foreground w-full min-h-screen flex flex-col p-4 gap-4">
            <h2 className="text-background text-2xl font-bold mx-auto">
                Buat Donasi Baru
            </h2>

            <div className="flex flex-col w-full gap-8 text-background">
                <label htmlFor="type" className="flex flex-col">
                    Jenis Donasi
                    <select
                        name="type"
                        className="capitalize p-2"
                        onChange={handleTypeChange}
                    >
                        <option value="" disabled selected>
                            --- Pilih Jenis Donasi ---
                        </option>
                        <option value="fundraiser">Fundraiser</option>
                        <option value="product_donation">Donasi Produk</option>
                    </select>
                </label>
                <label htmlFor="title" className="flex flex-col">
                    Judul
                    <input
                        className="capitalize p-2"
                        type="text"
                        name="title"
                        id="title"
                        placeholder="panjang maksimal 255 karakter"
                        value={data.title}
                        onChange={(e) =>
                            setData({ ...data, title: e.target.value })
                        }
                    />
                </label>
                <label htmlFor="header_image" className="flex flex-col">
                    Header Image
                    <input
                        type="file"
                        name="header"
                        id="header"
                        accept="image/*"
                        onChange={handleHeaderImageUpload}
                    />
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="header_image"
                            className="mx-auto w-1/2"
                        />
                    )}
                </label>
                {descriptions.map((inputField, index) =>
                    typeof inputField.value === "string" ? (
                        <DynamicTextDescription
                            key={index}
                            index={index}
                            value={inputField.value}
                            onChange={handleTextDescriptionChange}
                            onRemove={handleRemoveFields}
                        ></DynamicTextDescription>
                    ) : inputField.value instanceof File ? (
                        <DynamicImageDescription
                            key={index}
                            index={index}
                            url={URL.createObjectURL(inputField.value)}
                            onChange={handleImageDescriptionChange}
                            onRemove={handleRemoveFields}
                        ></DynamicImageDescription>
                    ) : (
                        <div key={index}></div>
                    )
                )}

                <div className="flex flex-row gap-4 mx-auto">
                    <AddTextDescriptionButton
                        onClick={handleAddTextDescription}
                    ></AddTextDescriptionButton>
                    <AddImageDescriptionButton
                        onFileSelected={handleAddImageDescription}
                    ></AddImageDescriptionButton>
                </div>

                <div className="flex flex-row gap-2 mx-auto w-full">
                    <button className="p-2 w-full bg-white text-red-500 font-black border border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 transition-colors duration-100">
                        Kembali
                    </button>
                    <button
                        className="p-2 w-full bg-white text-green-500 font-black border border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 transition-colors duration-100"
                        onClick={handleSubmit}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
}
