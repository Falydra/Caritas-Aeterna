export default function Hero() {
    return (
        <div className="relative flex w-full h-screen items-center justify-center overflow-y-hidden bg-cover bg-center bg-[url('/images/Charity.jpeg')]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-bg to-primary-bg/30"></div>
            <div className="relative flex flex-col items-start w-full px-4">
                <h1 className="text-4xl font-bold text-primary-fg">Caritas Aeterna</h1>
                <p className="text-primary-fg font-thin">
                    Your Generosity Can Change the World - Make a Difference Today by Donating <br />
                    Securely and Easily, Helping Those in Need, and Creating a Brighter Future for All.
                </p>
            </div>
        </div>
    );
}   