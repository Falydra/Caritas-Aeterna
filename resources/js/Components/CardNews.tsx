import card_news_data from "@/config/card_news_data"
import { Link } from "@inertiajs/react"
import { IoIosArrowForward } from "react-icons/io";
export default function CardNews() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen justify-start">
            <div className="flex flex-row w-full h-screen items-center justify-center gap-4 px-8">
                {card_news_data.map((news, index) => 
                    index < 3 && (
                        <div key={index} className="w-4/12 h-4/5 flex flex-col items-center justify-start bg-primary-fg hover:scale-105 transition-transform duration-500 ease-in-out rounded-2xl">
                            <div className={`w-full h-2/5 flex items-center justify-center bg-[url(${news.image})] bg-cover bg-center rounded-t-2xl cursor-pointer `}/>
                            <h1 className="text-xl font-bold text-primary-bg px-4 pt-4">
                                {news.title}
                            </h1>
                            <p className="text-sm text-primary-bg px-4">
                                {news.description}
                            </p>
                        </div>
                    )
                )}
            </div>
            <div className="flex flex-row w-full h-1/6 items-center justify-center gap-4 px-8">
                <Link href="/news" className="text-primary-fg w-full flex flex-row  items-center justify-end font-semibold hover:text-primary-accent">
                    Lihat Berita Lainnya
                    <IoIosArrowForward className="text-primary-fg"/>
                </Link>

            </div>
        </div>
            
    )
}