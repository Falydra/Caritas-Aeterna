import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="flex w-full h-[325px]  md:flex-row flex-row bg-primary-fg items-start py-4 justify-center px-16 gap-8 overflow-y-hidden ">
            <div className="flex flex-col w-4/12 h-full items-center justify-center gap-4">
                <img
                    src="/images/LogoYayasan.png"
                    className="w-2/5 aspect-square flex h-2/5"
                />
                <div className="flex flex-row items-center justify-start w-full gap-8 h-full">
                    <a
                        href="https://www.facebook.com/undip.official"
                        className="w-12 h-12 bg-primary-bg rounded-full items-center justify-center flex"
                    >
                        <FaFacebook className="w-6 h-6 text-primary-fg" />
                    </a>
                    <a
                        href="https://www.youtube.com/c/UndipTV"
                        className="w-12 h-12 bg-primary-bg rounded-full items-center justify-center flex"
                    >
                        <FaYoutube className="w-6 h-6 text-primary-fg" />
                    </a>
                    <a
                        href="https://x.com/undip"
                        className="w-12 h-12 bg-primary-bg rounded-full items-center justify-center flex"
                    >
                        <FaXTwitter className="w-6 h-6 text-primary-fg" />
                    </a>
                    <a
                        href="https://www.instagram.com/undip.official/"
                        className="w-12 h-12 bg-primary-bg rounded-full items-center justify-center flex"
                    >
                        <FaInstagram className="w-6 h-6 text-primary-fg" />
                    </a>
                </div>
            </div>
            <div className="flex flex-col w-3/12 h-full items-start justify-start gap-4">
                <h1 className="text-2xl font-bold text-primary-bg ">Layanan</h1>
                <div className="flex flex-col w-full h-full items-start justify-start gap-1">
                    <h2 className="text-xl  text-primary-bg cursor-pointer ">
                        Konseling Mahasiswa
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Career Center
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Perpustakaan
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Beasiswa
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Kalender Akademik
                    </h2>
                </div>
            </div>
            <div className="flex flex-col w-3/12 h-full items-start justify-start gap-4">
                <h1 className="text-2xl font-bold text-primary-bg ">
                    Kemahasiswaan
                </h1>
                <div className="flex flex-col w-full h-full items-start justify-start gap-1">
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Penerimaan Mahasiswa Baru
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Kuliah Online (Kulon)
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Urusan Internasional
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Kerjasama
                    </h2>
                </div>
            </div>
            <div className="flex flex-col w-2/12 h-full items-start justify-start gap-4">
                <h1 className="text-2xl font-extrabold text-primary-bg">
                    Info Lainnya
                </h1>
                <div className="flex flex-col w-full h-full items-start justify-start gap-1">
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Kepakaran
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Training Center
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Bus Kampus
                    </h2>
                    <h2 className="text-xl  text-primary-bg cursor-pointer">
                        Food Truck
                    </h2>
                </div>
            </div>
        </div>
    );
}
