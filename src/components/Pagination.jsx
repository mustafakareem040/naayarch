import React, {useCallback} from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = useCallback(() => {
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
    }, [currentPage, totalPages]);

    return (
        <div className="flex font-serif flex-row justify-center items-center gap-2 w-full mt-6 overflow-x-auto py-2 text-sm">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-100 rounded-md text-black disabled:opacity-50 whitespace-nowrap"
            >
                Previous
            </button>
            <div className="flex flex-row items-center gap-1">
                {getPageNumbers().map((number, index) => (
                    <React.Fragment key={index}>
                        {number === '...' ? (
                            <span className="w-6 text-gray-600 text-center">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(number)}
                                className={`w-8 h-8 flex-shrink-0 flex justify-center items-center rounded-md ${
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
                className="px-2 py-1 bg-gray-100 rounded-md text-black disabled:opacity-50 whitespace-nowrap"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;