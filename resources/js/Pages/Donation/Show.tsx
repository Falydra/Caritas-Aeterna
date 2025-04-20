import { PageProps, User } from "@/types";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

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

    console.log(combined);
    return combined;
}

export default function ShowDonation() {
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

    console.log("HELLO GUYS");
    console.log(donation);

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
                            <img className="w-1/3 mx-auto" src={item.value} alt="" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}



