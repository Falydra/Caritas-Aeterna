import initiator_data from "@/config/initiator_data";
import { elapsedDays, totalDonation } from "@/config/donation_attr";
import { IoIosArrowForward } from "react-icons/io";
import { Link, usePage } from "@inertiajs/react";
import { Donation, User } from "@/types";

interface DonationPageProps extends Donation {
    donation: Donation[];

    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

interface BookDonationProps extends Donation {
    bookDonation: Donation[];

    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

interface CharityNewsProps {
    isMore?: boolean;
    toggle?: "charity" | "book";
}

function formatPrice(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function CharityNews({ isMore = true, toggle = "charity" }: CharityNewsProps) {
    const { donation } = usePage<DonationPageProps>().props;
    const { bookDonation } = usePage<BookDonationProps>().props;
    if (donation.length < 2) {
        isMore = false;
    }

    console.log("isMore", isMore);
    
    
    return (
        <div className="flex flex-col items-center w-full h-screen justify-start gap-4 pt-16">
            <h1 className="text-2xl font-bold self-start px-4">
                Berita Donasi
            </h1>

            <div className="flex flex-row w-full h-3/5 justify-start items-start px-4">
            {toggle === "charity" && (

                <div className="grid-cols-3 flex justify-around gap-4 items-start w-full h-full">
                    
                    {donation.map(
                        (item, index) =>
                            index < 3 && (
                                <div
                                    key={index}
                                    className="w-11/12 h-full bg-gray-300 rounded-lg flex relative flex-col"
                                >
                                    <Link
                                        href={route("donations.show", {
                                            id: item.id,
                                        })}
                                        className="w-full h-3/5 flex"
                                    >
                                        <img
                                            src={item.header_image}
                                            className="w-full h-3/5 rounded-b-none object-cover absolute inset-0 rounded-lg"
                                        />
                                        <div className="w-2/12 h-6 bg-primary-accent z-10 top-1 left-1 items-center justify-center flex font-semibold text-xs relative rounded-3xl">
                                            <h1>Berita</h1>
                                        </div>
                                    </Link>
                                    <div className="w-full h-2/5 bg-gray-300 flex-col items-start rounded-b-lg flex justify-start">
                                        <div className="flex flex-col items-start justify-start py-2">
                                            <h3 className="text-primary-bg w-6/12 px-4 text-xs font-semibold ">
                                                {item.initiator.username}
                                            </h3>
                                        
                                        </div>

                                        <Link
                                            href={route("donations.show", {
                                                id: item.id,
                                            })}
                                            className="text-primary-bg hover:text-primary-accent leading-small px-4 text-lg font-bold cursor-pointer"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex flex-col items-start justify-start w-full h-full">
                                            <h1 className="text-primary-bg px-4 text-xs font-semibold cursor-pointer absolute bottom-6">
                                                Terkumpul
                                            </h1>
                                            <h1 className="text-primary-accent px-4 text-sm font-semibold cursor-pointer absolute bottom-1">
                                                 {item.type ===
                                                    "App\\Models\\ProductDonation"
                                                    ? item.type_attributes
                                                        .fulfilled_product_amount
                                                    : item.type ===
                                                        "App\\Models\\Fundraiser"
                                                        ? 
                                                        formatPrice(
                                                            item.type_attributes.current_fund
                                                        )
                                                        : "-"}{" "}
                                                /{" "}
                                                {item.type ===
                                                    "App\\Models\\ProductDonation"
                                                    ? item.type_attributes.product_amount +
                                                    " Produk"
                                                    : item.type ===
                                                        "App\\Models\\Fundraiser"
                                                        ? 
                                                        formatPrice(
                                                            item.type_attributes.target_fund
                                                        )
                                                        : "-"}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            ) }
             {toggle === "book" && (

                <div className="grid-cols-3 flex justify-around gap-4 items-start w-full h-full">
                    
                    {bookDonation.map(
                        (item, index) =>
                            index < 3 && (
                                <div
                                    key={index}
                                    className="w-11/12 h-full bg-gray-300 rounded-lg flex relative flex-col"
                                >
                                    <Link
                                        href={route("donations.show", {
                                            id: item.id,
                                        })}
                                        className="w-full h-3/5 flex"
                                    >
                                        <img
                                            src={item.header_image}
                                            className="w-full h-3/5 rounded-b-none object-cover absolute inset-0 rounded-lg"
                                        />
                                        <div className="w-2/12 h-6 bg-primary-accent z-10 top-1 left-1 items-center justify-center flex font-semibold text-xs relative rounded-3xl">
                                            <h1>Berita</h1>
                                        </div>
                                    </Link>
                                    <div className="w-full h-2/5 bg-gray-300 flex-col items-start rounded-b-lg flex justify-start">
                                        <div className="flex flex-col items-start justify-start py-2">
                                           
                                          
                                        </div>

                                        <Link
                                            href={route("donations.show", {
                                                id: item.id,
                                            })}
                                            className="text-primary-bg hover:text-primary-accent leading-small px-4 text-lg font-bold cursor-pointer"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex flex-col items-start justify-start w-full h-full">
                                            <h1 className="text-primary-bg px-4 text-xs font-semibold cursor-pointer absolute bottom-6">
                                                Terkumpul
                                            </h1>
                                            <h1 className="text-primary-accent px-4 text-sm font-semibold cursor-pointer absolute bottom-1">
                                                {item.type ===
                                                "App\\Models\\ProductDonation"
                                                    ? item.type_attributes
                                                          .product_amount
                                                    : item.type ===
                                                      "App\\Models\\Fundraiser"
                                                    ? item.type_attributes
                                                          .target_fund
                                                    : "-"}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            ) }
            </div>
            {isMore && (
                <div className="flex flex-row w-full items-center justify-end gap-4 px-8 ">
                    <Link
                        href={route("donation")}
                        className="text-primary-fg self-end flex flex-row items-center justify-end font-semibold hover:text-primary-accent"
                    >
                        Lihat Berita Lainnya
                        <IoIosArrowForward />
                    </Link>
                </div>
            )}
        </div>
    );
}
