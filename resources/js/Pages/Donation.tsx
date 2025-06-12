import CharityNews from "@/Components/CharityNews";
import { totalDonation } from "@/config/donation_attr";
import Guest from "@/Layouts/GuestLayout";
import { Donation, User } from "@/types"; 
import { Link, usePage } from "@inertiajs/react";

interface DonationPageProps extends Donation {
    donation: Donation[];
   
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

export default function DonationPage() {
    const {donations}  = usePage<DonationPageProps>().props;

   
    console.log(donations);

  

    return (
        <Guest>
            <div className="pt-[60px] w-full flex flex-col items-start justify-start gap-2">
                <h1 className="text-2xl font-bold px-8">Donasi</h1>
                <p className="text-sm px-8">
                    Donasi adalah salah satu cara untuk membantu sesama dan
                    memberikan dampak positif bagi masyarakat. Dengan berdonasi,
                    Anda dapat berkontribusi dalam berbagai program sosial dan
                    kemanusiaan yang bertujuan untuk meningkatkan kualitas hidup
                    orang lain.
                </p>
                <div className="w-full p-8 ">
                    <div className="grid-cols-3 grid justify-around gap-8 items-start w-full">
                    {donations.map((item: Donation, index: number) => (
                        
                        <div
                            key={index}
                            className="w-11/12 h-[280px] bg-gray-300 rounded-lg flex relative flex-col"
                        >
                            <Link
                                href={route("donations.show", { id: item.id })}
                                className="w-full h-3/5 flex"
                            >
                                <img
                                    src={
                                        item.header_image
                                            ? item.header_image.startsWith('/storage/')
                                                ? item.header_image
                                                : `/storage/${item.header_image}`
                                            : "images/Charity1.jpeg"
                                    }
                                    className="w-full h-[150px] rounded-b-none object-cover absolute inset-0 rounded-lg"
                                    alt={item.title}
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
                                    href={route("donations.show", { id: item.id })} 
                                    className="text-primary-bg hover:text-primary-accent leading-small px-4 text-lg font-bold cursor-pointer"
                                >
                                    {item.title}
                                </Link>
                                <div className="flex flex-col items-start justify-start w-full h-full">

                                    <h1 className="text-primary-bg px-4 text-xs font-semibold cursor-pointer absolute bottom-6">
                                        Terkumpul
                                    </h1>
                                    <h1 className="text-primary-accent px-4 text-sm font-semibold cursor-pointer absolute bottom-1">
                                        Rp {item.collected_amount?.toLocaleString("id-ID") ?? 0}
                                    </h1>
                                </div>

                            </div>
                            
                        </div>
                    

                    ))}
                    </div>
                </div>
            
            </div>  
            
        </Guest>
    )
}