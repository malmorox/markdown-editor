import { IoIosSave } from "react-icons/io";
import { useMarkdown } from "@hooks/useMarkdown";

const DownloadButton = () => {
    const { markdown } = useMarkdown();
    const hasContent = markdown.trim().length > 0;

    if (!hasContent) return null;

    const handleClick = () => {
        console.log("hola")
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center justify-center w-14 h-14 py-2 rounded-xl bg-sky-400 text-white hover:bg-sky-500 cursor-pointer"
        >
            <IoIosSave size={28} color="white" />
        </button>
    );
};

export default DownloadButton;