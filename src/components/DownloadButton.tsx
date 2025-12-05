import React from "react";
import { IoIosSave } from "react-icons/io";

const DownloadButton = () => {
    const handleClick = () => {
        console.log("hola")
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center justify-center w-16 h-16 py-2 rounded-xl bg-sky-400 text-white hover:bg-sky-500 cursor-pointer"
        >
            <IoIosSave size={32} color="white" />
        </button>
    );
};

export default DownloadButton;