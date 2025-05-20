import Guest from "@/Layouts/GuestLayout";
import { router, usePage } from "@inertiajs/react";
import initiator_data from "@/config/initiator_data";
import { Donation, User } from "@/types";
import CharityNews from "@/Components/CharityNews";
import ProgressBar from "@ramonak/react-progress-bar";
import { CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import GeneralNews from "../GeneralNews";
import { ChangeEvent, useState } from "react";
import nominal_donasi from "@/config/nominal_donasi";
import { Input } from "@headlessui/react";
import { IoDocumentTextOutline } from "react-icons/io5";

interface DonationDetailPageProsps extends Donation {
    donation: Donation;
    type:string;
    auth: {
        user: User;
        roles: string;
    };
    [key: string]: any;
}

export default function DonationDetail() {
    const { donation, auth } = usePage<DonationDetailPageProsps>().props;
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentAmount, setPayment] = useState(0);
    console.log("DonationDetail", donation.type_attributes.target_fund);
    console.log("DonationDetail", donation.header_image);


    
    
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
        <Guest>
             <div className="w-full flex flex-col items-start px-8 pt-8 justify-start bg-primary-bg">
                <h1 className="text-2xl font-bold">Rincian Donasi</h1>
                <div className="flex flex-row w-full h-screen justify-start items-start">


                    <div className="flex flex-col w-8/12 h-full justify-start items-start">
                       
                        <div className="w-11/12 aspect-square bg-gray-300 rounded-lg overflow-hidden">
                            <img
                                src={donation.header_image}
                                className="w-full h-full object-cover"
                                alt="Header Image"
                            />
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
                    <div className="flex flex-col w-4/12 h-5/6 justify-start items-start">  
                       <div className="flex flex-col border border-primary-fg p-4 gap-4 rounded-md w-full h-full justify-start items-start">
                            <ProgressBar
                                className="w-full"
                                labelAlignment="outside"
                                isLabelVisible={false}
                                completed={donation.type_attributes.current_fund}
                                maxCompleted={donation.type_attributes.target_fund}
                            />
                            <h1 className="font-thin text-xs text-center">
                                Terkumpul
                            </h1>
                            <h2 className="font-thin text-sm text-center text-primary-accent ">
                                Rp  {donation.type_attributes.current_fund} / {donation.type_attributes.target_fund}
                            </h2>
                                <div className="flex flex-row w-full py-4 items-center rounded-md hover:bg-primary-accent/50 h-1/6 border-b border-primary-fg/15 cursor-pointer">
                                    <CardTitle>Donasi</CardTitle>
                                    <div className="w-2/12 h-[20px] flex flex-col items-center justify-center rounded-3xl bg-primary-accent/40">
                                        <h1>Jawa</h1>
                                    </div>
                                </div>
                            <div className="w-full flex flex-col h-full items-start justify-start gap-y-8">
                                <div className="flex flex-col h-3/6 gap-y-4 w-full justify-between">
                                <div className="w-full overflow-y-auto h-full flex flex-col py-4 gap-4 shadow-sm rounded-md shadow-primary-fg">
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
                                <Button className="w-full h-10 bg-primary-accent hover:bg-primary-accent/50" onClick={handleModalButtonClick}>
                                    <h1 className="text-primary-fxg font-semibold">
                                        Donasi Sekarang
                                    </h1>
                                </Button>
                            </div>
                       </div>
                      
                       
                    </div>
                
                    
                </div>
                {/* <CharityNews isMore={true} /> */}
                {paymentModal && (
                <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex text-primary-bg items-center justify-center">
                    <div className="bg-white w-1/3 h-5/6 rounded-xl flex flex-col">
                        {auth.user ? (
                            <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
                                <h1 className="text-xl font-bold">
                                    Pilih Nominal Donasi
                                </h1>
                                <div className="relative w-full">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        Rp.
                                    </span>
                                    <Input
                                        placeholder="0"
                                       
                                        className="w-full h-[50px] pl-10 text-primary-bg rounded-b-none"
                                        value={paymentAmount}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                            handlePaymentAmountChange(e)
                                        }
                                    />
                                </div>
                                <div className="w-full h-[50px] flex flex-row items-center rounded-t-none justify-start bg-muted-foreground/30 p-4 rounded-xl">
                                    <IoDocumentTextOutline className="w-5 h-5 text-primary-bg" />
                                    <Input
                                        placeholder="Catatan (Opsional)"
                                        className="w-full focus:border-transparent focus-visible:ring-0 h-[50px] border-none shadow-none"
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
                                                    Rp {nominal.toLocaleString('id-ID')}
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
                                                        {initiator.user.username}
                                                    </h1>
                                                    <p className="text-xs text-muted-foreground">
                                                        {initiator.organization}
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
                                <div className="mt-auto flex flex-row items-center justify-between">
                                    <Button className="hover:bg-primary-fg bg-primary-accent">
                                        <a href="https://sites.google.com/view/termsandpolicy-donasipenggalan?usp=sharing">
                                            Bantuan
                                        </a>
                                    </Button>
                                    <Button
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
        </Guest>
    );
}