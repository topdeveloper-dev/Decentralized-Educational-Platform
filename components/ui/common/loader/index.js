const SIZES = {
    sm : "w-6 h-6",
    md : "w-8 h-8",
    lg : "w-12 h-12"
}

export default function Loader({size = "md"}){
    return (
        <>
        <div className={`spinner ${SIZES[size]}`}></div>
        </>
    )
}