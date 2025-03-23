import { useState } from "react";
import { Link } from "react-scroll";
import { CardWithForm } from "./CharityCard";

export default function Charity() {
    const [isMoney, setIsMoney] = useState(true);
    const [isBook, setIsBook] = useState(false);

    return (
        <div id="charity" className="items-center h-screen justify-center ">
            <section className="h-full bg-primary-bg flex flex-col items-center justify-start py-16">
                <div className="transform w-2/12 top-0 items-center justify-center flex flex-col">
                    <div className="relative w-full flex items-center justify-center px-1 py-1 bg-gray-700 border border-gray-600 rounded-full">
                        <div
                            className={`absolute top-0 left-0 h-full rounded-3xl w-1/2 bg-gradient-to-t from-gray-600 to-transparent shadow-[0_0_10px_3px_rgba(255,255,255,0.3)] transition-transform duration-300 ease-in-out ${
                                isMoney
                                    ? "translate-x-0 bg-gradient-to-t from-gray-400 z-12 to-transparent"
                                    : "translate-x-full bg-gradient-to-t from-gray-400 z-12 to-transparent"
                            }`}
                        />

                        <Link
                            to="money-charity"
                            smooth
                            delay={100}
                            className="relative w-full py-1 h-9 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out text-sm font-bold text-white cursor-pointer"
                            onClick={() => {
                                setIsMoney(true);
                                setIsBook(false);
                            }}
                        >
                            Charity
                        </Link>

                        <Link
                            to="book-charity"
                            smooth
                            delay={100}
                            className="relative w-full py-1 h-9 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out text-sm font-bold text-white cursor-pointer"
                            onClick={() => {
                                setIsMoney(false);
                                setIsBook(true);
                            }}
                        >
                            Book Donation
                        </Link>
                    </div>
                </div>

                <div
                    id="money-charity"
                    className={`w-full text-center items-center flex flex-col h-full justify-center py-8 ${
                        isMoney ? "" : "hidden"
                    }`}
                >
                    <h1 className="text-2xl font-bold text-primary-fg">
                        Berita Terkini
                    </h1>
                    <CardWithForm />
                </div>

                <div
                    id="book-charity"
                    className={`w-full text-center py-8 ${
                        isBook ? "" : "hidden"
                    }`}
                >
                    <h2 className="text-2xl font-bold">Book Donation</h2>
                    <p className="mt-2">Content for the Book Donation</p>
                </div>
            </section>
        </div>
    );
}
