export default function SelectedBooks() {
    return (
        <>
        
            <div className="w-full items-start py-4 flex start px-4">
                <h1 className="font-semibold text-xl text-primary-fg">
                    Seleted Book Details
                </h1>

            </div>
            <div className="w-full h-[250px] items-start py-4 flex flex-col px-4">
                <div className="w-full h-[125px] rounded-xl bg-muted/50" />
                <div className="flex flex-row justify-between w-full text-center mb-4">
                    <h2 className="text-primary-fg font-semibold text-lg self-center">
                        Book Details
                    </h2>
                    <h2 className="text-primary-fg font-thin text-xs self-center">
                        Estimated Delivery: 3 Days
                    </h2>

                </div>
                <div className="flex flex-row justify-between w-full text-center">
                    <h2 className="text-primary-fg text-sm self-center">
                        Available Copies:
                    </h2>
                    <h2 className="text-primary-fg font-thin text-xs self-center">
                        3/10
                    </h2>

                </div>
                <div className="flex flex-row justify-between w-full text-center">
                    <h2 className="text-primary-fg  text-sm self-center">
                        Status
                    </h2>
                    <h2 className="text-primary-fg font-thin text-xs self-center">
                        Available
                    </h2>

                </div>

            </div>
        </>


    );
}