import Guest from "@/Layouts/GuestLayout";
import { usePage } from "@inertiajs/react";
import initiator_data from "@/config/initiator_data";
import { Donation, User } from "@/types";
import CharityNews from "@/Components/CharityNews";
import ProgressBar from "@ramonak/react-progress-bar";
import { CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import GeneralNews from "../GeneralNews";

interface DonationDetailPageProsps extends Donation {
    donation: Donation;
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

export default function DonationDetail() {
    const { donation, auth } = usePage<DonationDetailPageProsps>().props;
    console.log("DonationDetail", donation.type_attributes.target_fund);

    

    return (
        <Guest>
             <div className="w-full flex flex-col items-start px-8 pt-8 justify-start bg-primary-bg">
                <h1 className="text-2xl font-bold">Rincian Donasi</h1>
                <div className="flex flex-row w-full h-screen justify-start items-start">


                    <div className="flex flex-col w-8/12 h-full justify-start items-start">
                        <div className=" flex justify-start gap-4 items-start w-full h-full">
                            <div className="w-11/12 h-full bg-gray-300 rounded-lg flex relative flex-col">
                                <img
                                    src={`/storage/app${donation.header_image}`}
                                    className="w-full h-3/5 rounded-b-none object-cover absolute inset-0 rounded-lg"
                                />
                            
                            </div>
                        </div>
                        <h1 className="text-primary-fg w-11/12 text-xl font-semibold ">
                            {donation.title}
                        </h1>
                        <h3 className="text-primary-fg w-6/12  text-xs font-semibold ">
                            {donation.initiator.username}
                        </h3>
                        <h3 className="text-primary-fg pb-4 text-xs font-semibold">
                            Sisa Waktu: {donation.type_attributes.elapsedDays} Hari
                        </h3>
                        <div className="flex flex-col w-11/12 h-full justify-start items-start">
                            <h1 className="text-primary-fg w-full text-lg font-semibold ">
                                Deskripsi
                            </h1>
                            <p className="text-primary-fg w-full text-sm text-justify font-normal">
                                {donation.text_descriptions[0]}
                            </p>
                        </div>
            
                                
                    </div>
                    <div className="flex flex-col w-4/12 h-4/6 justify-start items-start">  
                       <div className="flex flex-col border border-primary-fg p-4 gap-4 rounded-md w-full h-full justify-start items-start">
                            <ProgressBar
                                className="w-full"
                                labelAlignment="outside"
                                isLabelVisible={false}
                                completed={donation.type_attributes.current_fund}
                                maxCompleted={donation.type_attributes.target_fund}
                            />
                            <div className="w-full flex flex-col h-full items-start justify-start">
                                <h1 className="font-thin text-xs text-center">
                                    Terkumpul
                                </h1>
                                <h2 className="font-thin text-sm text-center text-primary-accent ">
                                   Rp  {donation.type_attributes.current_fund} / {donation.type_attributes.target_fund}
                                </h2>
                                <div className="flex flex-col h-4/6 gap-y-4 w-full justify-between">
                                    <div className="flex flex-row w-full py-4 items-center rounded-md hover:bg-primary-accent/50 h-1/6 border-b border-primary-fg/15 cursor-pointer">
                                        <CardTitle>Donasi</CardTitle>
                                        <div className="w-2/12 h-[20px] flex flex-col items-center justify-center rounded-3xl bg-primary-accent/40">
                                            <h1>Jawa</h1>
                                        </div>
                                    </div>
                                <div className="w-full overflow-y-auto h-5/6 flex flex-col py-4 gap-4 shadow-sm rounded-md shadow-primary-fg">
                                    <div className="w-full flex flex-col gap-4">
                            
                                        {[1,2,3,4,5,6,7,8].map((_, idx) => (
                                            <div key={idx} className="w-full h-[55px] py-2 hover:bg-primary-accent flex rounded-md cursor-pointer items-center flex-row gap-4 justify-start px-2">
                                                <div className="w-10 h-10 flex items-center aspect-square justify-center rounded-full bg-primary-fg cursor-pointer text-primary-fg"></div>
                                                <div className="w-full flex-col items-start justify-center flex ">
                                                    <h1 className="text-md font-semibold">{donation.initiator.username}</h1>
                                                    <h3 className="text-sm text-muted-foreground">Rp 10.000</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                </div>
                                <Button className="w-full h-10 mt-4 bg-primary-accent hover:bg-primary-accent/50">
                                    <h1 className="text-primary-fxg font-semibold">
                                        Donasi Sekarang
                                    </h1>
                                </Button>
                            </div>
                       </div>
                    </div>
                
                    
                </div>
                <CharityNews isMore={true} />
                
                
                 
             

               
            </div>
        </Guest>
    );
}