import { GetBookResponse } from "@/types/book";
import { memo } from "react";

function bookcardComponent({
    book
}: {
    book: GetBookResponse;
}) {
    return (
        <div className="border-x border-b py-3.5 px-4 flex flex-row gap-2 md:gap-5 text-wrap break-all">
            <div className="min-w-28 min-h-36 sm:min-h-48 bg-primary text-wrap break-all p-4 rounded-md flex-1 justify-center items-center flex">
                <div className="text-primary-foreground pb-12 font-mono font-bold text-sm text-center">
                    <h1>{book.title}</h1>
                </div>
            </div>
            <div className="flex-[4] md:flex-[6] flex flex-col justify-between">
                <div>
                    <h1 className="font-bold text-lg font-mono">{book.title}</h1>
                    <h2 className="text-xs font-mono text-secondary-foreground pb-2">{book.author}</h2>
                    <p className="text">{book.description}</p>
                </div>
                <div>
                    {book.is_booked ? (
                        <>
                            {book.booked_until ? (<h1>Booked until {new Date(book.booked_until).toLocaleDateString()}</h1>) : null}
                        </>
                    ) : (
                        <h1>Available to book!</h1>
                    )}
                </div>
            </div>
        </div>
    )
}

const BookCard = memo(bookcardComponent, function (oldProps, newProps) {
    return oldProps.book.id === newProps.book.id
});

export default BookCard;