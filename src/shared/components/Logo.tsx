
export const Logo = () => {
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex w-full justify-center items-center space-x-4">
                <div className="h-1.5 w-16 bg-white rounded-full"></div>
                <div className="h-1.5 w-16 bg-white rounded-full"></div>
            </div>
            <h1 className="text-white text-3xl font-extrabold my-2 text-center tracking-wide">
                BARRIO MILITAR
            </h1>
            <h2 className="text-white text-3xl font-extrabold text-center tracking-wide">
                GENERAL DEHEZA
            </h2>
            <div className="flex w-full justify-center items-center space-x-4 mt-2">
                <div className="h-1.5 w-16 bg-white rounded-full"></div>
                <div className="h-1.5 w-16 bg-white rounded-full"></div>
            </div>
        </div>
    )
}