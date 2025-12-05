import React from "react";
import { IoIosSave } from "react-icons/io";

interface DownloadButtonProps {
  content: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ content }) => {
    const handleClick = () => {
        console.log("hola")
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            <IoIosSave size={22} />
        </button>
    );
};

export default DownloadButton;