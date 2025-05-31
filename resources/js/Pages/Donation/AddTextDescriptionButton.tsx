import React from "react";

interface AddTextDescriptionButtonProps {
    onClick: () => void;
}

const AddTextDescriptionButton: React.FC<AddTextDescriptionButtonProps> = ({
    onClick
}) => {
    return (
        <button
            className="add-btn flex flex-row gap-2 py-2 px-3 place-items-center border-primary-fg text-primary-fg border rounded-md hover:bg-blue-500 hover:text-white active:bg-blue-600 transition-colors duration-100"
            onClick={onClick}
        >
            <p className="font-bold">Tambah Paragraf</p>
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
    );
}

export default AddTextDescriptionButton;
