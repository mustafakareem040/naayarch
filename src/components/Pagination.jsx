import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 3) {
                pageNumbers.push('...');
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    return (
        <div className="flex font-serif flex-row justify-center items-center gap-1 sssm:gap-2 ssm2:gap-3 ssm4:gap-4 w-full mt-6 overflow-x-auto py-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-1 sssm:px-2 ssm3:px-4 py-1 sssm:py-1.5 ssm2:py-2 bg-gray-100 rounded-md text-xs sssm:text-sm ssm3:text-base font-serif text-black disabled:opacity-50 whitespace-nowrap"
            >
                Previous
            </button>
            <div className="flex flex-row items-center gap-1 sssm:gap-1.5 ssm2:gap-2">
                {getPageNumbers().map((number, index) => (
                    <React.Fragment key={index}>
                        {number === '...' ? (
                            <span className="w-4 text-gray-600 sssm:w-5 ssm:w-6 ssm3:w-8 text-center">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(number)}
                                className={`w-5 h-5 sssm:w-6 sssm:h-6 ssm:w-7 ssm:h-7 ssm3:w-8 ssm3:h-8 flex-shrink-0 flex justify-center items-center rounded-md text-xs sssm:text-sm ssm2:text-base font-serif ${
                                    currentPage === number
                                        ? 'bg-[#3B5345] text-white font-bold'
                                        : 'text-black'
                                }`}
                            >
                                {number}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-1 sssm:px-2 ssm3:px-4 py-1 sssm:py-1.5 ssm2:py-2 bg-gray-100 rounded-md text-xs sssm:text-sm ssm3:text-base font-serif text-black disabled:opacity-50 whitespace-nowrap"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;