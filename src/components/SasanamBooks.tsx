import React from "react";


interface SasanamBookData {
  _id: string;
  bookName: string;
  authorName: string;
  sectionId: string;
  __v: number;
}

interface SasanamBooksProps {
  data: SasanamBookData[];
  loading?: boolean;
}

const SasanamBooks: React.FC<SasanamBooksProps> = ({ data, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full p-4">
      
        {(data.map((book) => (
            <div
              key={book._id}
              className="relative group bg-[#F5F5DC] border border-[#e2c9a0] rounded-2xl shadow-[0_4px_24px_rgba(61,37,22,0.08)] p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:bg-[#f9f6ef] hover:shadow-[0_8px_32px_rgba(61,37,22,0.13)]"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#EEDDCC]/70 mb-4 shadow-inner ring-2 ring-[#e2c9a0]">
                <svg className="w-8 h-8 text-[#a78e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="#a78e7e" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-[#4A3B32] mb-2 drop-shadow-sm tracking-wide group-hover:text-[#7c5c3e] transition-colors duration-200">
                {book.bookName}
              </h3>
              <p className="text-base font-semibold text-[#7c5c3e] mb-1">Author: <span className="text-[#a78e7e] font-bold">{book.authorName}</span></p>
            </div>
          )))}
    </div>
  );
};

export default SasanamBooks;
