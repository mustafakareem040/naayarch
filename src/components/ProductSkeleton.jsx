export default function ProductSkeleton() {
    return (
        <div className="bg-gradient-custom relative flex flex-col w-full pb-16 animate-pulse">
            <div className="relative w-full h-0 pb-[100%] bg-gray-200 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-custom rounded-lg p-3 flex flex-col justify-end h-2/5">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex justify-between items-center mt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
