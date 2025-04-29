import initiator_data from "@/config/initiator_data"
import { elapsedDays } from "@/config/donation_attr"
import { IoIosArrowForward } from "react-icons/io"

export default function CharityNews() {
    return (
        <div className="flex flex-col items-center w-full h-screen justify-start pt-16">
            <h1 className="text-2xl font-bold">Berita Lainnya</h1>
            {/* //Create a carousel for the news. Create a new card using multiple div with the Image and Title, descripsion and detail button for each news. Create 3 Cards within the carousel. Make it Auto Slide every 5 seconds. */}
            <div className="flex flex-row w-full h-full justify-center items-center px-8">
                <div className="flex flex-row justify-around gap-4 items-center w-full h-full">
                    {initiator_data.map((item, index) => (

                        <div className="w-11/12 h-4/5 bg-gray-300 rounded-lg relative flex-col">
                            <div className="w-full h-2/5 flex">
                                <img src="images/Charity1.jpeg" className="w-full h-2/5 rounded-b-none object-cover absolute inset-0 rounded-lg" />
                                <div className="w-2/12 h-6 bg-primary-accent z-10 top-1 left-1 items-center justify-center flex font-semibold text-xs relative rounded-3xl">
                                    <h1>
                                        Berita
                                    </h1>
                                </div>
                            </div>
                            <h3 className="text-primary-bg w-6/12 pt-4 px-4 text-xs font-semibold cursor-pointer hover:text-primary-accent">
                                {item.organization}
                            </h3>
                            <h3 className="text-primary-bg pb-4 px-4 text-xs font-semibold">
                                Sisa Waktu: {elapsedDays} Hari
                            </h3>

                            <h1 className="text-primary-bg px-4 text-xl font-semibold cursor-pointer">
                            {item.donation_title}
                            </h1>
                            <p className="text-primary-bg text-balance px-4 text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        


                        </div>
                    ))}

                   
                </div>
            </div>            
            
        </div>
    )
}