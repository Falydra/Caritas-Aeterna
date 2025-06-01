import React from "react";
import RemoveDescriptionButton from "./RemoveDescriptionButton";

interface DynamicTextDescriptionProps {
    value: string;
    index: any;
    onChange: (index: any, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRemove: (index: any) => void;
}

const DynamicTextDescription: React.FC<DynamicTextDescriptionProps> = ({
    value,
    index,
    onChange,
    onRemove,
}) => {
    return (
        <label
            className="flex flex-col gap-2 w-full"
            htmlFor={index}
            key={index}
        >
            <div className="flex flex-row gap-2">
                Deskripsi
                <RemoveDescriptionButton
                    index={index}
                    onRemove={onRemove}
                ></RemoveDescriptionButton>
            </div>
            <textarea
                className="p-2 w-full text-black bg-transparent border-primary-fg border rounded-md"
                name={index}
                value={value}
                onChange={(e) => onChange(index, e)}
                rows={5}
                placeholder="Deskripsi"
            ></textarea>
        </label>
    );
};

export default DynamicTextDescription;
