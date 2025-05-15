import { PageProps, User } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { ChangeEvent, useState } from "react";

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

function sendDonationRequest() {}

export default function ShowDonation() {
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentAmount, setPayment] = useState(0);

    interface Donation {
        id: number;
        title: string;
        type: string;
        type_attributes: {
            [key: string]: any;
        };
        header_image: string;
        text_descriptions: {
            [key: number]: string;
        };
        image_descriptions: {
            [key: number]: string;
        };
        status: string;
    }

    interface ShowDonationProps extends PageProps {
        auth: {
            user: User;
            roles: string;
        };
        donation: Donation;
    }

    const { auth, donation } = usePage<ShowDonationProps>().props;
    const title = donation.title;
    const descriptions = combineDescriptionSorted(
        donation.text_descriptions,
        donation.image_descriptions
    );
    const amount = [10000, 25000, 50000, 75000, 100000, 125000, 150000, 200000];

    console.log(donation);

    function handleModalButtonClick() {
        setPaymentModal(true);
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
                note: "this is a note"
            }
        };

        await router.post('/donations/donate', payload, {
            onSuccess: () => {
                console.log("Success");
            },
            onError: (err) => {
                console.log("Error: ", err);
            },
        });

        console.log(payload);
    }

    return (
        <div className="flex flex-col gap-4 py-4 px-32">
            <p className="font-bold text-4xl capitalize">{title}</p>
            <img className="px-64" src={`${donation.header_image}`} alt="" />
            <div className="flex flex-col gap-4">
                {descriptions.map((item, index) => (
                    <div key={index}>
                        {item.type === "text" ? (
                            <p>{item.value}</p>
                        ) : (
                            <img
                                className="w-1/3 mx-auto"
                                src={item.value}
                                alt=""
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="mx-auto">
                {!paymentModal && (
                    <button
                        className="bg-primary-accent px-4 py-2 rounded-md hover:bg-hover-accent active:bg-primary-accent transition-colors duration-100"
                        onClick={handleModalButtonClick}
                    >
                        Donasi
                    </button>
                )}
            </div>
            <div className="absolute bottom-8 left-32 right-32">
                {paymentModal && (
                    <div className="flex flex-col gap-4 bg-primary-fg p-4 rounded-lg">
                        <p className="text-primary-bg">Pilih Jumlah Donasi</p>
                        <div className="grid grid-cols-4 gap-2 ">
                            {amount.map((x) => (
                                <button
                                    key={x}
                                    className="bg-primary-accent px-4 py-2 rounded-lg hover:bg-hover-accent active:bg-primary-accent transition-colors duration-100"
                                    onClick={() => handlePaymentButtonClick(x)}
                                >
                                    {x}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 text-primary-bg">
                            <label htmlFor="payment-amount-input flex flex-col gap-2">
                                Masukkan Jumlah Donasi
                            </label>
                            <input
                                className="p-2"
                                type="number"
                                name="payment-amount-input"
                                id="payment-amount-input"
                                value={paymentAmount}
                                onChange={(e) => handlePaymentAmountChange(e)}
                            />
                            <button
                                className="w-full py-2 mx-auto rounded-lg text-primary-fg bg-primary-accent hover:bg-primary-accent active:bg-primary-accent transition-colors duration-100"
                                onClick={() => handleSubmit()}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
