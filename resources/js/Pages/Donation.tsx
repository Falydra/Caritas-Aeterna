import CharityNews from "@/Components/CharityNews";
import Guest from "@/Layouts/GuestLayout";
import { Donation, User } from "@/types"; 
import { usePage } from "@inertiajs/react";

interface DonationPageProps extends Donation {
    donations: Donation[];
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}


export default function DonationPage() {
    const {donations}  = usePage<DonationPageProps>().props;

    // console.log(donations.map((item) => item));

  

    return (
        <Guest>
            <div className="pt-[60px] w-full h-full flex flex-col items-start justify-start">
                <h1 className="text-2xl font-bold px-8">Donasi</h1>
                <p className="text-sm px-8">
                    Donasi adalah salah satu cara untuk membantu sesama dan
                    memberikan dampak positif bagi masyarakat. Dengan berdonasi,
                    Anda dapat berkontribusi dalam berbagai program sosial dan
                    kemanusiaan yang bertujuan untuk meningkatkan kualitas hidup
                    orang lain.
                </p>
                
               
                
            



            </div>  
            
        </Guest>
    )
}