import React, { useState } from "react";
import DynamicTextDescription from "./DynamicTextDescription";
import AddTextDescriptionButton from "./AddTextDescriptionButton";
import AddImageDescriptionButton from "./AddImageDescriptionButton";
import DynamicImageDescription from "./DynamicImageDescription";
import { router, usePage } from "@inertiajs/react";
import { PageProps, User, Book, BookWithAmount, Facility } from "@/types";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectGroup,
    SelectLabel,
} from "@/Components/ui/select";
import SearchBook from "../Book/Search";
import { Inertia } from "@inertiajs/inertia";
import BookCollection from "../Book/Collection";
import FacilityCollection from "../Facility/Collection";

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

    // const [descriptions, setDescriptions] = useState([{ value: "" }]);
    const [descriptions, setDescriptions] = useState<
        { value: string | File }[]
    >([{ value: "" }]);

    // books with amount
    const [selectedBooks, setSelectedBooks] = useState<BookWithAmount[]>([]);

    // facilities data
    const [addedFacilities, setAddedFacilities] = useState<Facility[]>([]);

    // update books data
    const handleAddBook = (book: Book, amount = 1) => {
        setSelectedBooks((prev) => {
            const existing = prev.find((item) => item.book.isbn === book.isbn);

            if (existing) {
                const updatedAmount = existing.amount + amount;

                if (updatedAmount === 0) {
                    return prev.filter((item) => item.book.isbn !== book.isbn);
                }

                return prev.map((item) =>
                    item.book.isbn === book.isbn
                        ? { ...item, amount: item.amount + amount }
                        : item
                );
            }
            return [...prev, { book, amount }];
        });
    };

    const handleDeleteBook = (book: Book) => {
        setSelectedBooks((prev) => {
            return prev.filter((item) => item.book.isbn !== book.isbn);
        });
    };

    // update facility data
    const handleAddFacility = (updatedFacility: Facility) => {
        setAddedFacilities((prev) => {
            const exists = prev.some(
                (facility) => facility.id === updatedFacility.id
            );

            if (exists) {
                if (updatedFacility.amount === 0) {
                    return prev.filter(
                        (item) => item.id !== updatedFacility.id
                    );
                }

                return prev.map((facility) =>
                    facility.id === updatedFacility.id
                        ? updatedFacility
                        : facility
                );
            } else {
                return [...prev, updatedFacility];
            }
        });
    };

    const handleDeleteFacility = (facility: Facility) => {
        setAddedFacilities((prev) => {
            return prev.filter((item) => item.id !== facility.id);
        });
    };

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

        var product_fund = 0;

        // append books
        selectedBooks.forEach((bookItem, index) => {
            payload.append(
                `data[products][books][${index}][isbn]`,
                bookItem.book.isbn
            );
            payload.append(
                `data[products][books][${index}][amount]`,
                String(bookItem.amount)
            );
            product_fund += bookItem.book.price;
        });

        // append facility
        addedFacilities.forEach((facility, index) => {
            payload.append(
                `products[facilities][${index}][name]`,
                facility.name
            );
            payload.append(
                `products[facilities][${index}][description]`,
                facility.description
            );
            payload.append(
                `products[facilities][${index}][dimension]`,
                facility.dimensions
            );
            payload.append(
                `products[facilities][${index}][material]`,
                facility.material
            );
            payload.append(
                `products[facilities][${index}][price]`,
                String(facility.price)
            );
            payload.append(
                `products[facilities][${index}][amount]`,
                String(facility.amount)
            );
            product_fund += Number(facility.price);
        });

        // append type attributes
        if (data.type === "fundraiser") {
            payload.append(
                "data[type_attributes][target_fund]",
                fundraiserAttr.target_fund.toString()
            );
            payload.append(
                "data[type_attributes][product_amount]",
                "0"
            );
        } else {
            payload.append(
                "data[type_attributes][target_fund]",
                product_fund.toString()
            );
            payload.append(
                "data[type_attributes][product_amount]",
                productDonationAttr.product_amount.toString()
            );
        }

        var donationStoreUrl = "/donations";

        await router.post(donationStoreUrl, payload, {
            onSuccess: () => {
                console.log("Success");
            },
            onError: (err) => {
                console.log("Error: ", err);
            },
        });
    };

    console.log("donation url", donationStoreUrl)
    return (
        <div className=" w-full min-h-screen flex flex-col p-4 gap-4">
            <h2 className="text-primary-fg text-2xl font-bold self-start">
                Buat Donasi Baru
            </h2>

            <div className="flex flex-col w-full gap-4 bg-transparent ">
                <label
                    htmlFor="type"
                    className="flex flex-col text-primary-fg bg-transparent "
                >
                    Jenis Donasi
                    {/* <select
                        name="type"
                        className="capitalize p-2 text-primary-fg text-opacity-75 outline-none cursor-pointer bg-transparent border border-primary-fg/50 focus:border-primary-fg rounded-md"
                        onChange={handleTypeChange}
                    >
                        <option value="" className="bg-transparent text-primary-bg flex border border-primary-fg border-y-none" disabled selected>
                            --- Pilih Jenis Donasi ---
                        </option>
                        <option value="fundraiser" className="bg-transparent flex border border-primary-fg border-y-none">Fundraiser</option>
                        <option value="product_donation" className="bg-transparent flex border border-primary-fg border-y-none">Donasi Produk</option>
                    </select> */}
                    <Select
                        name="type"
                        onValueChange={(value) => {
                            setData({ ...data, type: value });
                        }}
                    >
                        <SelectTrigger className="w-full border border-primary-fg/50 focus:border-primary-fg text-primary-fg">
                            <SelectValue
                                className="text-md text-primary-fg"
                                placeholder="--- Pilih Jenis Donasi ---"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    --- Pilih Jenis Donasi ---
                                </SelectLabel>
                                <SelectItem
                                    value="fundraiser"
                                    className="cursor-pointer "
                                >
                                    Fundraiser
                                </SelectItem>
                                <SelectItem
                                    value="product_donation"
                                    className="cursor-pointer "
                                >
                                    Donasi Produk
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <span className="text-primary-fg text-opacity-55 text-sm py-2">
                        Pilih jenis donasi yang ingin dibuat
                    </span>
                </label>

                {data.type && data.type === "fundraiser" && (
                    <label htmlFor="target_fund" className="flex flex-col">
                        Jumlah Donasi
                        <input
                            className="capitalize py-2 px-3 outline-none text-sm text-primary-fg text-opacity-75 bg-transparent border border-primary-fg/50 focus:border-primary-fg rounded-md  cursor-text"
                            type="number"
                            name="target_fund"
                            id="target_fund"
                            placeholder="berupa angka"
                            onChange={(e) =>
                                setFundraiserAttr({
                                    ...fundraiserAttr,
                                    target_fund: e.target.value,
                                })
                            }
                        />
                        <span className="text-primary-fg text-opacity-55 text-sm py-2">
                            Jumlah donasi yang diusulkan
                        </span>
                    </label>
                )}

                {data.type === "product_donation" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            Tambahkan Buku
                            <div className="flex flex-row gap-4">
                                <BookCollection
                                    className="w-2/3"
                                    selectedBooks={selectedBooks}
                                    onChangeAmount={handleAddBook}
                                    onDeleteBook={handleDeleteBook}
                                />
                                <SearchBook
                                    className="w-1/3"
                                    onAddbook={handleAddBook}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            Tambahkan Barang
                            <div className="flex flex-row gap-4">
                                <FacilityCollection
                                    className="w-full"
                                    addedFacilities={addedFacilities}
                                    onAddFacility={handleAddFacility}
                                    onDeleteFacility={handleDeleteFacility}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <label htmlFor="title" className="flex flex-col">
                    Judul
                    <input
                        className="capitalize py-2 px-3 outline-none text-sm text-primary-fg text-opacity-75 bg-transparent border border-primary-fg/50 focus:border-primary-fg rounded-md  cursor-text"
                        type="text"
                        name="title"
                        id="title"
                        placeholder="panjang maksimal 255 karakter"
                        value={data.title}
                        onChange={(e) =>
                            setData({ ...data, title: e.target.value })
                        }
                    />
                    <span className="text-primary-fg text-opacity-55 text-sm py-2">
                        Judul donasi yang akan ditampilkan
                    </span>
                </label>
                <label htmlFor="header_image" className="flex flex-col">
                    Header Image
                    <input
                        type="file"
                        name="header"
                        id="header"
                        accept="image/*"
                        onChange={handleHeaderImageUpload}
                        className="p-2 bg-transparent border border-primary-fg rounded-md"
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

                <div className="flex flex-row gap-4 ">
                    <AddTextDescriptionButton
                        onClick={handleAddTextDescription}
                    ></AddTextDescriptionButton>
                    <AddImageDescriptionButton
                        onFileSelected={handleAddImageDescription}
                    ></AddImageDescriptionButton>
                </div>

                <div className="flex flex-row gap-2 mx-auto w-full">
                    <button className="p-2 w-full rounded-md text-red-500 font-black border border-primary-fg hover:bg-red-500 hover:text-white active:bg-red-600 transition-colors duration-100">
                        Kembali
                    </button>
                    <button
                        className="p-2 w-full rounded-md text-green-500 font-black border border-primary-fg hover:bg-green-500 hover:text-white active:bg-green-600 transition-colors duration-100"
                        onClick={handleSubmit}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
}
