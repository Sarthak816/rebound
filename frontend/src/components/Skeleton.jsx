const SkeletonCard = () => {
    return (
        <div className="bg-white border border-academic-200 rounded-lg p-4 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="h-5 bg-academic-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-academic-100 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-academic-100 rounded w-1/3"></div>
                </div>
                <div className="flex gap-2 ml-4">
                    <div className="w-8 h-8 bg-academic-100 rounded"></div>
                    <div className="w-8 h-8 bg-academic-100 rounded"></div>
                    <div className="w-8 h-8 bg-academic-100 rounded"></div>
                </div>
            </div>
        </div>
    );
};

const SkeletonStats = () => {
    return (
        <div className="bg-white border border-academic-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-academic-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-24 bg-academic-100 rounded-lg"></div>
                <div className="h-24 bg-academic-100 rounded-lg"></div>
                <div className="h-24 bg-academic-100 rounded-lg"></div>
            </div>
            <div className="h-48 bg-academic-100 rounded"></div>
        </div>
    );
};

const SkeletonStudentCard = () => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-academic-200 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="h-5 bg-academic-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-academic-100 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-academic-100 rounded"></div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-academic-100 rounded"></div>
                <div className="h-4 bg-academic-100 rounded"></div>
                <div className="h-4 bg-academic-100 rounded"></div>
            </div>
            <div className="mt-4 h-10 bg-academic-100 rounded"></div>
        </div>
    );
};

export { SkeletonCard, SkeletonStats, SkeletonStudentCard };
