import { Button } from "./ui/button";

export default function Layanan() {
    return (
        <div className="flex relative flex-col items-center w-full min-h-screen justify-start gap-4 py-16">
            <h1 className="text-primary-fg text-2xl font-bold">
                Layanan Lainnya
            </h1>
            <div className="flex relative flex-row items-center w-full h-full justify-center">

                <div className="flex-1 h-[272px] md:rounded-3xl flex-col md:rounded-tr-none md:rounded-br-none gap-2 pb-6 px-4 pt-8 bg-primary-fg bg-opacity-30 flex items-center justify-center">

                    
                
                    <h1 className="text-primary-fg text-xl font-bold">
                        Undip Bermanfaat
                    </h1>
                    <p className="text-primary-fg text-sm font-semibold w-1/2 text-justify">
                        Layanan yang kami tawarkan adalah layanan yang bermanfaat bagi masyarakat luas. Undip Bermanfaat adalah program yang bertujuan untuk memberikan layanan yang bermanfaat bagi masyarakat luas.
                        
                    </p>
                
                
                </div>

                <div className="md:h-4 md:w-0 relative flex-shrink-0 items-center bg-transparent justify-between z-10">
                    <div className="block absolute md:-left-4 md:skew-x-[45deg] skew-x-[115deg] top-1/2 left-1/2 transform -translate-x-16 -translate-y-1/2 md:-translate-y-0 h-[136px] md:w-4 w-8 bg-primary-bg" />
                    <div className="block absolute md:-left-4 md:skew-x-[-45deg] skew-x-[115deg] top-1/2 left-1/2 transform -translate-x-16 -translate-y-1/2 md:-translate-y-full h-[136px] md:w-4 w-8 bg-primary-bg" />
                    <div className="block absolute  md:-left-4 md:skew-x-[135deg] skew-x-[115deg] top-1/2 left-1/2 transform translate-x-20 -translate-y-1/2 md:-translate-y-0 h-[136px] md:w-4 w-8 bg-primary-bg" />
                    <div className="block absolute md:-left-4 md:skew-x-[-135deg] skew-x-[115deg] top-1/2 left-1/2 transform translate-x-20 -translate-y-1/2 md:-translate-y-full h-[136px] md:w-4 w-8 bg-primary-bg" />
                
                </div>

                <div className="flex-1 h-[272px] md:rounded-3xl flex-col md:rounded-tl-none md:rounded-bl-none gap-6 pb-6 px-4 pt-8 bg-primary-fg bg-opacity-30 flex items-center justify-center">
                
                <h1 className="text-primary-fg text-xl font-bold">
                        Undip Bermartabat
                    </h1>
                    <p className="text-primary-fg text-sm font-semibold w-1/2 text-justify">
                        Layanan yang kami tawarkan adalah layanan yang bermanfaat bagi masyarakat luas. Undip Bermanfaat adalah program yang bertujuan untuk memberikan layanan yang bermanfaat bagi masyarakat luas.
                        
                    </p>
                </div>
            </div>
        </div>
    )
}