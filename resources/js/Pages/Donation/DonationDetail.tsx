import Guest from "@/Layouts/GuestLayout";
import { router, usePage } from "@inertiajs/react";
import initiator_data from "@/config/initiator_data";
import { Donation, Facility, User } from "@/types";
import ProgressBar from "@ramonak/react-progress-bar";
import { CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import GeneralNews from "../GeneralNews";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { toast } from "sonner";
import SearchBook from "@/Pages/Book/Search";
import BookCollection from "@/Pages/Book/Collection";
import { Book } from "@/types";

interface DonationDetailPageProsps extends Donation {
    donation: Donation;
    type: string;
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

function combineDescriptionSorted(
    text_descriptions: { [key: number]: string },
    image_descriptions: { [key: number]: string }
) {
    const combined: { type: string; value: string }[] = [];
    const allKeys = [
        ...Object.keys(text_descriptions),
        ...Object.keys(image_descriptions),
    ]
        .map(Number)
        .sort((a, b) => a - b);

    for (const key of allKeys) {
        if (text_descriptions[key] !== undefined) {
            combined.push({ type: "text", value: text_descriptions[key] });
        } else if (image_descriptions[key] !== undefined) {
            combined.push({ type: "image", value: image_descriptions[key] });
        }
    }

    return combined;
}

function formatPrice(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function DonationDetail() {
    const { donation, auth } = usePage<DonationDetailPageProsps>().props;
    const descriptions = combineDescriptionSorted(
        donation.text_descriptions,
        donation.image_descriptions
    );
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentAmount, setPayment] = useState(0);
    const [selectedBooks, setSelectedBooks] = useState<
        { book: Book; amount: number }[]
    >([]);
    const imageDescriptions = descriptions.filter(
        (item) => item.type === "image"
    );
    const previewImages = [
        { type: "header", value: donation.header_image },
        ...imageDescriptions,
    ];
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const amount = [10000, 25000, 50000, 75000, 100000, 125000, 150000, 200000];
    const [productAmount, setProductAmount] = useState(1);
    const [productDonationModal, setProductDonationModal] = useState(false);
    const [resi, setResi] = useState("");
    const [packagePicture, setPackagePicture] = useState<File | null>(null);
    const [isbn, setIsbn] = useState("");

    // New
    const [bookData, setBookData] = useState<
        { isbn: string; amount: number; }[]
    >([]);

    const [facilityData, setFacilityData] = useState<
        { id: number; amount: number; }[]
    >([]);

    const totalAmount = bookData.reduce((sum, item) => sum + item.amount, 0) + facilityData.reduce((sum, item) => sum + item.amount, 0);

    const isBookSelected = (book: Book) => {
        return bookData.some((b) => b.isbn === book.isbn);
    };

    const handleAddBook = (book: Book, amount = 1) => {
        setBookData((prev) => {
            const existing = prev.find((b) => b.isbn === book.isbn);

            if (existing) {
                const updatedAmount = existing.amount + amount;

                if (updatedAmount === 0) {
                    return prev.filter((b) => b.isbn !== book.isbn);
                }

                return prev.map((b) =>
                    b.isbn === book.isbn
                        ? { ...b, amount: b.amount + amount }
                        : b
                );
            }
            return [...prev, { isbn: book.isbn, amount: amount }];
        });
    };

    const handleDeleteBook = (book: Book) => {
        setBookData((prev) =>
            prev.filter((b) => b.isbn !== book.isbn)
        );
    };

    const isFacilitySelected = (facility: Facility) => {
        return facilityData.some((f) => f.id === facility.id);
    }

    const handleAddFacility = (facility: Facility, amount: number) => {
        setFacilityData((prev) => {
            const existing = prev.find((f) => f.id === facility.id);

            if (existing) {
                const updatedAmount = existing.amount + amount;

                if (updatedAmount === 0) {
                    return prev.filter((f) => f.id !== facility.id);
                }

                return prev.map((f) =>
                    f.id === facility.id
                        ? { ...f, amount: f.amount + amount }
                        : f
                );
            }
            return [...prev, { id: Number(facility.id), amount: amount }];
        });
    }

    const handleDeleteFacility = (facility: Facility) => {
        setFacilityData((prev) =>
            prev.filter((f) => f.id !== facility.id)
        );
    };

    useEffect(() => {
        if (previewImages.length === 0) return;
        intervalRef.current = setInterval(() => {
            setCurrentImageIdx((idx) => (idx + 1) % previewImages.length);
        }, 3000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [previewImages.length, donation.header_image]);

    const handleChangeAmount = (book: Book, delta: number) => {
        setSelectedBooks((prev) =>
            prev.map((b) =>
                b.book.isbn === book.isbn
                    ? { ...b, amount: Math.max(1, b.amount + delta) }
                    : b
            )
        );
    };

    const handleProductDonationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("data[type]", donation.type);
        formData.append("data[user_id]", String(auth.user.id));
        formData.append("data[donation_id]", String(donation.id));
        bookData.forEach((b, idx) => {
            formData.append(`data[products][books][${idx}][isbn]`, b.isbn);
            formData.append(
                `data[products][books][${idx}][amount]`,
                String(b.amount)
            );
        });
        facilityData.forEach((f, idx) => {
            formData.append(`data[products][facilities][${idx}][id]`, String(f.id));
            formData.append(`data[products][facilities][${idx}][amount]`, String(f.amount));
        });
        formData.append("data[resi]", resi);
        if (packagePicture) {
            formData.append("data[package_picture]", packagePicture);
        }

        setProductDonationModal(false);

        router.post(route("donations.donate"), formData, {
            onSuccess: () => {
                console.log("Product donation successful");

                toast.success("Donasi produk berhasil!");
                router.reload({ only: ["donation"] });
            },
        });
    };

    const type = donation.type.split("\\").at(-1);

    function handleModalButtonClick() {
        if (donation.type === "App\\Models\\ProductDonation") {
            setProductDonationModal(true);
        } else {
            setPaymentModal(true);
        }
    }

    function handlePaymentButtonClick(x: number) {
        setPayment(x);
    }

    const handlePaymentAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPayment(parseInt(e.target.value));
    };

    const handleSubmit = async () => {
        const payload = {
            data: {
                type: donation.type,
                user_id: auth.user.id,
                donation_id: donation.id,
                amount: paymentAmount,
                note: "this is a note",
            },
        };

        await router.post("/donations/donate", payload, {
            onSuccess: () => {
                console.log("Success");
            },
            onError: (err) => {
                console.log("Error: ", err);
            },
        });
    };

    return (
        <Guest>
            <div className="w-full flex flex-col flex-grow gap-4 items-start px-8 pt-12 pb-8 justify-start bg-primary-bg">
                {type == "Fundraiser" ? (
                    <h1 className="text-2xl font-bold">
                        Rincian Penggalangan Dana
                    </h1>
                ) : (
                    <h1 className="text-2xl font-bold">
                        Rincian Donasi Produk
                    </h1>
                )}

                <div className="flex flex-row gap-6 w-full h-full justify-start items-start">
                    <div className="flex flex-col gap-4 w-9/12 h-full justify-start items-start">
                        <div className="w-full h-96 aspect-square bg-gray-300 rounded-lg">
                            <img
                                key={currentImageIdx}
                                src={previewImages[currentImageIdx]?.value}
                                className="w-full h-full rounded-lg object-cover transition-all duration-700 animate-fade-in"
                                alt="Header Image"
                            />
                        </div>
                        <div className="w-full h-[100px] flex flex-row items-start justify-start space-x-2">
                            <img
                                src={donation.header_image}
                                className=" h-full rounded-lg object-cover"
                                alt="Header Image"
                            />
                            {descriptions.map(
                                (item, index) =>
                                    item.type === "image" && (
                                        <img
                                            key={index}
                                            src={item.value}
                                            className="h-full object-cover rounded-lg"
                                            alt={`Description ${index}`}
                                        />
                                    )
                            )}
                        </div>
                        <h1 className="text-primary-fg w-full text-3xl font-semibold ">
                            {donation.title}
                        </h1>
                        <div className="flex flex-row gap-4">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3408/3408590.png"
                                className="w-12 h-12 p-1 aspect-square bg-slate-300 rounded-full"
                                alt=""
                            />
                            <h3 className="text-primary-fg w-full my-auto font-semibold ">
                                {donation.initiator.username}
                            </h3>
                        </div>

                        {descriptions.map((item, index) => (
                            <div key={index} className="w-full flex flex-col">
                                {item.type === "text" && (
                                    <p className="text-primary-fg text-sm font-normal text-justify">
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 w-3/12 h-fit max-h-screen justify-start items-start">
                        {donation.type === "App\\Models\\ProductDonation" && (
                            <div className="flex flex-col p-4 gap-4 w-full h-fit border border-primary-fg rounded-md justify-start place-items-start">
                                <h2 className="font-semibold text-xl text-center">
                                    Produk
                                </h2>

                                {donation.books?.map((book) => (
                                    <div className="flex flex-row w-full items-center" key={book.isbn}>
                                        <label
                                            htmlFor={book.isbn}
                                            className="flex flex-row gap-2 cursor-pointer select-none justify-center items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                name={book.isbn}
                                                id={book.isbn}
                                                checked={bookData.some((b) => b.isbn === book.isbn)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleAddBook(book, 1);
                                                    } else {
                                                        handleDeleteBook(book);
                                                    }
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <p>{book.title}</p>
                                                <p className="text-xs">
                                                    {book.authors[0]},{" "}
                                                    {book.published_year}
                                                </p>
                                            </div>
                                        </label>
                                        {isBookSelected(book) && (
                                            <div className="flex flex-row h-8 ml-auto justify-center items-center gap-1" id="dynamic">
                                                <button onClick={() => {
                                                    handleAddBook(book, -1);
                                                }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-4 ml-auto"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 12h14"
                                                        />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    id="amount"
                                                    className="max-w-6 m-2 bg-transparent border-b border-primary-bg focus:border-primary-fg text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none focus:ring-0 transition-all duration-100 select-none"
                                                    value={bookData.find((b) => b.isbn === book.isbn)?.amount ?? ""}
                                                    disabled
                                                />
                                                <button
                                                    onClick={() => {
                                                        handleAddBook(book, 1);
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-4 mr-auto"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 4.5v15m7.5-7.5h-15"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {donation.facilities?.map((facility) => (
                                    <div className="flex flex-row w-full items-center" key={facility.id}>
                                        <label
                                            htmlFor={String(facility.id)}
                                            className="flex flex-row gap-2 cursor-pointer select-none justify-center items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                name={String(facility.id)}
                                                id={String(facility.id)}
                                                checked={facilityData.some((f) => f.id === facility.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleAddFacility(facility, 1);
                                                    } else {
                                                        handleDeleteFacility(facility);
                                                    }
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <p>{facility.name}</p>
                                                <p className="text-xs">
                                                    {facility.dimension}{" | "}
                                                    {facility.material}
                                                </p>
                                            </div>
                                        </label>
                                        {isFacilitySelected(facility) && (
                                            <div className="flex flex-row h-8 ml-auto justify-center items-center gap-1" id="dynamic">
                                                <button onClick={() => {
                                                    handleAddFacility(facility, -1);
                                                }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-4 ml-auto"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 12h14"
                                                        />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    id="amount"
                                                    className="max-w-6 m-2 bg-transparent border-b border-primary-bg focus:border-primary-fg text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none focus:ring-0 transition-all duration-100 select-none"
                                                    value={facilityData.find((f) => f.id === facility.id)?.amount ?? ""}
                                                    disabled
                                                />
                                                <button
                                                    onClick={() => {
                                                        handleAddFacility(facility, 1);
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-4 mr-auto"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 4.5v15m7.5-7.5h-15"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {(bookData.length > 0 || facilityData.length > 0) && (
                                    <Button
                                        className="w-full h-10 disabled:bg-primary-fg/50 select-none bg-primary-accent hover:bg-primary-accent/50 cursor-pointer"
                                        onClick={handleModalButtonClick}
                                        disabled={
                                            donation.status === "finished"
                                        }
                                    >
                                        Donasi Sekarang
                                    </Button>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col border border-primary-fg p-4 gap-4 rounded-md w-full h-full justify-start items-start">
                            <ProgressBar
                                className="w-full"
                                labelAlignment="outside"
                                isLabelVisible={false}
                                completed={
                                    donation.type ===
                                        "App\\Models\\ProductDonation"
                                        ? donation.type_attributes
                                            .fulfilled_product_amount
                                        : donation.type ===
                                            "App\\Models\\Fundraiser"
                                            ? formatPrice(
                                                donation.type_attributes
                                                    .current_fund
                                            )
                                            : "-"
                                }
                                maxCompleted={
                                    donation.type ===
                                        "App\\Models\\ProductDonation"
                                        ? donation.type_attributes
                                            .product_amount
                                        : donation.type ===
                                            "App\\Models\\Fundraiser"
                                            ? formatPrice(
                                                donation.type_attributes
                                                    .target_fund
                                            )
                                            : "-"
                                }
                                completed={
                                    donation.type ===
                                        "App\\Models\\ProductDonation"
                                        ? donation.type_attributes
                                            .fulfilled_product_amount
                                        : donation.type ===
                                            "App\\Models\\Fundraiser"
                                            ? donation.type_attributes.current_fund
                                            : 0
                                }
                                maxCompleted={
                                    donation.type ===
                                        "App\\Models\\ProductDonation"
                                        ? donation.type_attributes
                                            .product_amount
                                        : donation.type ===
                                            "App\\Models\\Fundraiser"
                                            ? donation.type_attributes.target_fund
                                            : 100
                                }
                            />
                            <h1 className="font-thin text-xs text-center">
                                Terkumpul
                            </h1>
                            <h2 className="font-thin text-sm text-center text-primary-accent ">
                                {/* Rp {donation.type_attributes.current_fund} /{" "}
                                {donation.type_attributes.target_fund} */}
                                {donation.type ===
                                    "App\\Models\\ProductDonation"
                                    ? donation.type_attributes
                                        .fulfilled_product_amount
                                    : donation.type ===
                                        "App\\Models\\Fundraiser"
                                        ? "Rp " +
                                        formatPrice(
                                            donation.type_attributes.current_fund
                                        )
                                        : "-"}{" "}
                                /{" "}
                                {donation.type ===
                                    "App\\Models\\ProductDonation"
                                    ? donation.type_attributes.product_amount +
                                    " Produk"
                                    : donation.type ===
                                        "App\\Models\\Fundraiser"
                                        ? "Rp " +
                                        formatPrice(
                                            donation.type_attributes.target_fund
                                        )
                                        : "-"}
                            </h2>
                            <div className="flex flex-row w-full py-4 items-center rounded-md hover:bg-primary-accent/50 h-1/6 border-b border-primary-fg/15 cursor-pointer">
                                <CardTitle>Donasi Terbaru</CardTitle>
                            </div>
                            <div className="w-full flex flex-col h-full items-start justify-start gap-y-8 ">
                                <div className="flex flex-col h-3/6 gap-y-4 w-full justify-between">
                                    <div className="w-full flex flex-col py-4 gap-4 shadow-sm rounded-md shadow-primary-fg h-full overflow-y-auto">
                                        <div className="w-full flex flex-col gap-4">
                                            {/* Ganti bagian ini dengan data donasi terbaru dari database */}
                                            {donation.latest_donations &&
                                                donation.latest_donations.length >
                                                0 ? (
                                                donation.latest_donations.map(
                                                    (
                                                        donor: any,
                                                        idx: number
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="w-full h-[55px] py-2 hover:bg-primary-accent flex rounded-md cursor-pointer items-center flex-row gap-4 justify-start px-2"
                                                        >
                                                            <div className="w-10 h-10 flex items-center aspect-square justify-center rounded-full bg-primary-fg cursor-pointer text-primary-fg">
                                                                {/* Bisa tambahkan avatar jika ada */}
                                                            </div>
                                                            <div className="w-full flex-col items-start justify-center flex ">
                                                                <h1 className="text-md font-semibold">
                                                                    {donor.user
                                                                        ?.username ??
                                                                        "Anonim"}
                                                                </h1>
                                                                <h3 className="text-sm text-muted-foreground">
                                                                    Rp{" "}
                                                                    {donor.amount?.toLocaleString(
                                                                        "id-ID"
                                                                    )}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className="text-sm text-muted-foreground px-2">
                                                    Belum ada donasi terbaru.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {donation.type ===
                                    "App\\Models\\Fundraiser" && (
                                        <Button
                                            className="w-full h-10 disabled:bg-primary-fg/50 select-none bg-primary-accent hover:bg-primary-accent/50 cursor-pointer"
                                            onClick={handleModalButtonClick}
                                            disabled={
                                                donation.status === "finished"
                                            }
                                        >
                                            Donasi Sekarang
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <CharityNews isMore={true} /> */}

                {productDonationModal && auth.user && (
                    <div className="fixed z-50 backdrop-blur-md inset-0 bg-black bg-opacity-50 flex text-primary-bg items-center justify-center">
                        <div className="bg-white w-1/3 h-fit rounded-xl flex flex-col p-4 overflow-y-auto">
                            <form
                                onSubmit={handleProductDonationSubmit}
                                className="w-full flex flex-col gap-4"
                            >
                                <h2 className="text-lg font-bold">Konfirmasi Donasi Produk</h2>
                                <label>
                                    Jumlah Produk
                                    <input
                                        type="number"
                                        min={1}
                                        value={totalAmount}
                                        onChange={e => setProductAmount(Number(e.target.value))}
                                        className="w-full p-2 border rounded-md border-primary-bg"
                                        required
                                    />
                                </label>
                                <label>
                                    Resi Pengiriman
                                    <input
                                        type="text"
                                        value={resi}
                                        onChange={e => setResi(e.target.value)}
                                        className="w-full p-2 border border-primary-bg rounded-md"
                                        required
                                    />
                                </label>
                                <label>
                                    Bukti Pengiriman (Gambar)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setPackagePicture(e.target.files?.[0] || null)}
                                        className="w-full p-2 border rounded-md border-primary-bg"
                                        required
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="bg-primary-accent text-white px-4 py-2 rounded-md transition-shadow duration-200 shadow hover:shadow-[0_0_16px_4px_rgba(37,99,235,0.5)]"
                                    onClick={handleProductDonationSubmit}
                                >
                                    Donasi Produk
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setProductDonationModal(false)}
                                    className="bg-primary-bg text-primary-fg hover:text-primary-bg px-4 py-2 rounded transition-colors duration-300 hover:bg-transparent hover:border hover:border-primary-bg"
                                >
                                    Tutup
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {paymentModal && auth.user && (
                    <div className="fixed z-50 inset-0 bg-black backdrop-blur-md bg-opacity-50 flex text-primary-bg items-center justify-center">
                        <div className="bg-white w-1/3 h-5/6 rounded-xl flex flex-col">
                            {auth.user ? (
                                <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
                                    <h1 className="text-xl font-bold">
                                        Pilih Nominal Donasi
                                    </h1>
                                    <div className="relative w-full border flex rounded-md border-b-0 rounded-b-none border-primary-bg">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 roounded-md">
                                            Rp.
                                        </span>
                                        <input
                                            placeholder="0"
                                            className="w-full h-[50px] pl-10 text-primary-bg  rounded-md"
                                            value={paymentAmount}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) =>
                                                handlePaymentAmountChange(e)
                                            }
                                        />
                                    </div>
                                    <div className="w-full h-[50px] flex flex-row items-center rounded-t-none justify-start bg-muted-foreground/30 p-4 rounded-xl">
                                        <IoDocumentTextOutline className="w-5 h-5 text-primary-bg" />
                                        <input
                                            placeholder="Catatan (Opsional)"
                                            className="w-full focus:border-transparent bg-transparent focus-visible:ring-0 h-[50px] border-none shadow-none"
                                        />
                                    </div>
                                    <div className="w-full py-4 grid grid-cols-3 gap-4">
                                        {amount.map(
                                            (nominal, index) =>
                                                index < 6 && (
                                                    <Button
                                                        key={index}
                                                        className="text-primary-bg hover:bg-primary-fg bg-muted-foreground/50"
                                                        onClick={() =>
                                                            handlePaymentButtonClick(
                                                                nominal
                                                            )
                                                        }
                                                    >
                                                        Rp{" "}
                                                        {nominal.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </Button>
                                                )
                                        )}
                                    </div>
                                    <h1 className="text-xl font-bold self-start">
                                        Detail Donasi
                                    </h1>
                                    {initiator_data.map(
                                        (initiator, index) =>
                                            index < 1 && (
                                                <div
                                                    className="w-full h-[75px] flex  rounded-xl items-center flex-row gap-4 justify-start"
                                                    key={index}
                                                >
                                                    <div className="w-12 h-12 flex items-center aspect-square justify-center rounded-full bg-[url(/images/Charity1.jpeg)] bg-center bg-cover cursor-pointer text-primary-fg"></div>
                                                    <div className="w-full flex-col items-start justify-center flex">
                                                        <h1 className="text-lg font-bold">
                                                            {
                                                                initiator.donation_title
                                                            }
                                                        </h1>
                                                        <h1 className="text-sm font-semibold">
                                                            {
                                                                initiator.user
                                                                    .username
                                                            }
                                                        </h1>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                initiator.organization
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                    <h1 className="text-lg font-bold self-start">
                                        Pembayaran
                                    </h1>
                                    <div className="w-full h-1/6 flex flex-row items-center justify-between gap-4">
                                        <Button className="hover:bg-primary-fg w-full h-4/5 border border-primary-bg bg-primary-fg/40">
                                            <img
                                                src="/images/Qris.png"
                                                className="w-full aspect-square h-full scale-75"
                                                onClick={handleSubmit}
                                            />
                                        </Button>
                                        <Button className="hover:bg-primary-fg w-full h-4/5 border border-primary-bg bg-primary-fg/40">
                                            <img
                                                src="/images/Bank.png"
                                                className="w-3/4 aspect-square h-full scale-75"
                                            />
                                        </Button>
                                    </div>
                                    <div className="mt-auto flex flex-col items-center justify-between gap-1">
                                        <Button
                                            className="hover:bg-primary-fg bg-primary-accent w-full"
                                            onClick={handleSubmit}
                                        >
                                            Donasi
                                        </Button>
                                        <Button
                                            className="hover:bg-primary-fg bg-primary-bg w-full"
                                            onClick={() =>
                                                setPaymentModal(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                    <h1>Silahkan Login terlabih dahulu</h1>
                                    <div className="w-full h-1/6 flex flex-row items-center justify-center gap-4">
                                        <Button
                                            onClick={() =>
                                                setPaymentModal(false)
                                            }
                                            className="hover:bg-primary-fg bg-primary-bg"
                                        >
                                            Tutup
                                        </Button>
                                        <Button className="bg-primary-bg hover:bg-primary-accent">
                                            <a href="/login">Login</a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* <CharityNews isMore={true}/> */}
        </Guest>
    );
}
