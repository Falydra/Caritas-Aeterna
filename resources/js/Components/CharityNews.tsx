export default function CharityNews() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen justify-start pt-16">
            <h1 className="text-2xl font-bold">Berita Lainnya</h1>
            {/* //Create a carousel for the news. Create a new card using multiple div with the Image and Title, descripsion and detail button for each news. Create 3 Cards within the carousel. Make it Auto Slide every 5 seconds. */}
            <div className="flex flex-row w-full justify-center items-center">
                <div className="flex flex-col items-center w-1/3">
                    <div className="w-64 h-64 bg-gray-300 rounded-lg">
                        <img src="https://via.placeholder.com/150" alt="News" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <h1 className="text-lg font-bold mt-4">Judul Berita</h1>
                    <p className="text-sm mt-2">Deskripsi Berita</p>
                    <button className="bg-primary-accent text-white px-4 py-2 mt-4 rounded-lg">Detail</button>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="w-64 h-64 bg-gray-300 rounded-lg">
                        <img src="https://via.placeholder.com/150" alt="News" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <h1 className="text-lg font-bold mt-4">Judul Berita</h1>
                    <p className="text-sm mt-2">Deskripsi Berita</p>
                    <button className="bg-primary-accent text-white px-4 py-2 mt-4 rounded-lg">Detail</button>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="w-64 h-64 bg-gray-300 rounded-lg">
                        <img src="https://via.placeholder.com/150" alt="News" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <h1 className="text-lg font-bold mt-4">Judul Berita</h1>
                    <p className="text-sm mt-2">Deskripsi Berita</p>
                    <button className="bg-primary-accent text-white px-4 py-2 mt-4 rounded-lg">Detail</button>
                </div>
            </div>            
            
        </div>
    )
}