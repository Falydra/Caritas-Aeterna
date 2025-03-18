import DonationHistory from "@/Components/DonationHistory";
import SelectedBooks from "@/Components/SelectedBooks";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Transition } from "@headlessui/react";
import { book_data } from "@/config/book_data";
import { Books } from "@/types";
import { Scheduler } from "@aldabil/react-scheduler";

export default function Page() {
  const [selectedBooks, setSelectedBooks] = useState(false);
  const [activePage, setActivePage] = useState<string>("Books");
  const [isAdded, setIsAdded] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);

  const handleSelectedBooks = (book: Books) => {
    setSelectedBook(book);
    setSelectedBooks(true);
  };

  const handleMenuItemClick = (title: string) => {
    setActivePage(title);
  };

  console.log(selectedBook);

  return (
    <Authenticated
      rightSidebarChildren={
        <Transition
          show={selectedBooks}
          enter="transition transform duration-300 ease-out"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition transform duration-300 ease-in"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="w-5/12 h-screen overflow-y-auto flex flex-col items-center justify-center border-l relative border-primary-fg">
            <RxCross2
              className="transform-y-1/2 top-5 right-4 absolute w-6 h-6 text-primary-fg cursor-pointer self-end"
              onClick={() => setSelectedBooks(false)}
            />
            <SelectedBooks book={selectedBook} />
          </div>
        </Transition>
      }
    >
      {selectedBooks ? (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <div className="grid grid-cols-2 px-8 gap-4 w-full items-center justify-center py-4">
            {book_data.map(
              (book, index) =>
                index < 4 && (
                  <div
                    key={book.id}
                    className="w-full h-[125px] rounded-xl flex p-2 flex-row bg-muted/50 cursor-pointer hover:bg-primary-accent"
                    onClick={() => handleSelectedBooks(book)}
                  >
                    <div
                      className="w-1/4 h-full rounded-xl self-center"
                      style={{
                        backgroundImage: `url("${book.image}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="w-3/4 px-4 h-full flex flex-col items-start justify-start text-primary-bg overflow-y-auto">
                      <div className="flex flex-row items-start justify-start w-full text-center">
                        <h2 className="font-semibold text-xl self-center">
                          {book.title}
                        </h2>
                      </div>
                      <div className="flex flex-row justify-between w-full text-center">
                        <h2 className="font-semibold text-sm self-center">
                          Author
                        </h2>
                        <h2 className="font-thin text-xs self-center">
                          {book.author}
                        </h2>
                      </div>
                      <div className="flex flex-col items-start justify-between w-full">
                        <h2 className="font-semibold text-sm">Description</h2>
                        <h2 className="font-thin text-xs text-justify">
                          {book.description}
                        </h2>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="flex flex-col w-full items-center justify-center h-full px-8">
            <div className="h-[450px] w-full flex-1 rounded-xl bg-muted/50 self-center" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <div className="grid grid-cols-3 px-8 gap-4 w-full items-center justify-center py-4">
            {book_data.map((book) => (
              <div
                key={book.id}
                className="w-full h-[125px] rounded-xl flex p-2 flex-row bg-muted/50 cursor-pointer hover:bg-primary-accent"
                onClick={() => handleSelectedBooks(book)}
              >
                <div
                  className="w-1/4 h-full rounded-xl self-center"
                  style={{
                    backgroundImage: `url("${book.image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="w-3/4 px-4 h-full flex flex-col items-start justify-start text-primary-bg overflow-y-auto">
                  <div className="flex flex-row items-start justify-start w-full text-center">
                    <h2 className="font-semibold text-xl text-start">
                      {book.title}
                    </h2>
                  </div>
                  <div className="flex flex-row justify-between w-full text-center">
                    <h2 className="font-semibold text-sm self-center">
                      Author
                    </h2>
                    <h2 className="font-thin text-xs self-center">
                      {book.author}
                    </h2>
                  </div>
                  <div className="flex flex-col items-start justify-between w-full">
                    <h2 className="font-semibold text-sm">Description</h2>
                    <h2 className="font-thin text-xs text-justify">
                      {book.description}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full items-center justify-center h-full px-8">
            <div className="h-[450px] w-full flex-1 rounded-xl bg-muted/50 self-center">
            <Scheduler
                view="month"
                events={[
                  {
                    event_id: 1,
                    title: "Event 1",
                    start: new Date("2025/3/22 09:30"),
                    end: new Date("2025/3/22 10:30"),
                  },
                  {
                    event_id: 2,
                    title: "Event 2",
                    start: new Date("2025/3/24 10:00"),
                    end: new Date("2025/3/24 11:00"),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </Authenticated>
  );
}
