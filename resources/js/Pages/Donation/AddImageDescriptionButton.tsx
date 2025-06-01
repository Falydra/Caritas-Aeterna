import React, { useRef } from "react";

interface AddImageDescriptionButtonProps {
    onFileSelected: (file: File) => void;
}

const AddImageDescriptionButton: React.FC<AddImageDescriptionButtonProps> = ({
    onFileSelected
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelected(file);
        }

        // Clear the input value so the same file can be picked again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <button
                className="add-btn flex flex-row gap-2 py-2 px-3 place-items-center  text-primary-fg rounded-md border border-primary-fg hover:bg-blue-500 hover:text-white active:bg-blue-600 transition-colors duration-100"
                onClick={handleClick}
                type="button"
            >
                <p className="font-bold">Tambah Gambar</p>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </>
    );
};

export default AddImageDescriptionButton;
