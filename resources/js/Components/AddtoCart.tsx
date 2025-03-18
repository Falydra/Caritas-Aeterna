import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { AddToCartProps } from "@/types";
import { Books } from "@/types";


interface AddToCartExtendedProps extends AddToCartProps {
  book: Books | null;
}

export default function AddtoCart({
  isAdded,
  setIsAdded,
  book,
}: AddToCartExtendedProps) {
  const promise = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ name: "Sonner" }), 2000)
    );

  const handleConfirm = () => {
    setIsAdded(!isAdded);
    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => `Product has been added to cart`,
      error: "Error",
    });
  };

  if (!book) {
    return <div>No book selected</div>;
  }

  return (
    <div className="fixed z-10 top-1/2 left-1/2 transform flex -translate-x-1/2 -translate-y-1/2 w-full h-screen backdrop-blur-sm text-primary-bg p-4 rounded-xl items-center justify-center">
      <div className="w-3/12 h-[550px] border border-primary-fg bg-primary-bg flex flex-col items-start justify-center rounded-2xl overflow-y-auto">
        <div className="w-full h-[50px] items-start py-2 flex-row flex justify-start gap-4 text-primary-fg px-4">
          <RxCross2
            className="w-8 h-8 text-primary-fg cursor-pointer"
            onClick={() => setIsAdded(!isAdded)}
          />
          <h1 className="font-bold text-lg">{book.title}</h1>
        </div>
        <div className="w-full h-3/5 items-center flex-col flex justify-center text-primary-fg px-4">
          <div className="w-full h-[125px] rounded-xl bg-primary-fg flex" 
          style={
            {backgroundImage: `url("${book.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        }
          />
          <div className="flex flex-row justify-between w-full text-center mb-4">
            <h2 className="text-primary-fg font-semibold text-lg self-center">
              Book Details
            </h2>
            <h2 className="text-primary-fg font-thin text-xs self-center">
              Estimated Delivery: 3 Days
            </h2>
          </div>
          <div className="flex flex-row justify-between w-full text-center">
            <h2 className="text-primary-fg text-sm self-center">Available Copies:</h2>
            <h2 className="text-primary-fg font-thin text-xs self-center">3/10</h2>
          </div>
          <div className="flex flex-row justify-between w-full text-center">
            <h2 className="text-primary-fg text-sm self-center">Status</h2>
            <h2 className="text-primary-fg font-thin text-xs self-center">Available</h2>
          </div>
        </div>
        <div className="w-full h-4/5 overflow-y-auto flex flex-col items-center justify-center px-4">
          <h2 className="text-primary-fg font-semibold text-lg self-start mt-2">
            Description
          </h2>
          <span className="text-primary-fg font-thin text-sm text-justify">
            {book.description}
          </span>
          <div className="flex flex-row justify-between w-full text-center mt-2">
            <h2 className="text-primary-fg font-semibold text-sm self-center">
              Author
            </h2>
            <h2 className="text-primary-fg font-thin text-xs self-center">
              {book.author}
            </h2>
          </div>
          <div className="flex flex-row justify-between w-full text-center">
            <h2 className="text-primary-fg font-semibold text-sm self-center">
              Publisher
            </h2>
            <h2 className="text-primary-fg font-thin text-xs self-center">
              {book.publisher}
            </h2>
          </div>
          <div className="flex flex-row justify-between w-full text-center">
            <h2 className="text-primary-fg font-semibold text-sm self-center">
              Publication Date
            </h2>
            <h2 className="text-primary-fg font-thin text-xs self-center">
              {book.published_date}
            </h2>
          </div>
        </div>
        <div className="w-full flex h-1/5 justify-center items-center flex-row">
          <div className="flex flex-row justify-between w-full text-center h-1/5 px-4">
            <Button
              variant="default"
              onClick={handleConfirm}
              className="w-full bg-primary-accent hover:bg-green-500 text-primary-fg font-semibold text-sm self-center mt-4"
            >
              Confirm
            </Button>
          </div>
          <div className="flex flex-row justify-between w-full text-center px-4">
            <Button
              variant="destructive"
              onClick={() => setIsAdded(!isAdded)}
              className="w-full bg-primary-accent text-primary-fg font-semibold text-sm self-center mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
