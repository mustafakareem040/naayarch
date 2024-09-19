const CartItemSkeleton = () => {
    return (
        <div className="flex gap-2 justify-between items-stretch p-4 bg-[rgba(246,243,241,0.3)] shadow-[0px_2px_4px_3px_rgba(0,0,0,0.1)] rounded-md mb-4 w-full animate-pulse">
            <div className="w-full max-h-[300px] relative aspect-[4/5] ssm:w-1/2 bg-gray-300 rounded-lg overflow-hidden"></div>

            <div className="flex flex-col items-center gap-3 w-[120px]">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/4"></div>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <div className="w-[41px] h-[40px] bg-gray-300 rounded-lg"></div>
                <div className="w-[41px] h-[40px] bg-gray-300 rounded-lg"></div>
            </div>
        </div>
    );
};

export default CartItemSkeleton;