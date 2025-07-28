import { AiOutlinePicture } from "react-icons/ai";
import { FaRegFileAlt } from "react-icons/fa";

interface Props {
  fileUrl: string;
  fileName: string;
  imageUrl: string;
  onCancel: () => void;
  onSend: () => void;
  captionValue: string;
  onCaptionChange: (value: string) => void;
  captionRef: React.RefObject<HTMLTextAreaElement>;
}

export const FilePreviewModal = ({
  fileUrl,
  imageUrl,
  fileName,
  onCancel,
  onSend,
  captionValue,
  onCaptionChange,
  captionRef,
}: Props) => {
  return (
    <div className="absolute z-50 w-[400px] top-[20%] px-[20px] py-[10px] rounded-[10px] bg-white text-blue-400">
      <p>Send {imageUrl ? "an image" : "a file"}</p>
      <a href={imageUrl || fileUrl} target="_blank" rel="noopener noreferrer">
        <div className="flex gap-4 p-2 bg-white rounded">
          <div className="bg-blue-400 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {imageUrl ? <AiOutlinePicture /> : <FaRegFileAlt />}
          </div>
          <span className="text-black truncate">{fileName}</span>
        </div>
      </a>
      <textarea
        ref={captionRef}
        value={captionValue}
        onChange={(e) => onCaptionChange(e.target.value)}
        className="w-full mt-2 p-2 border-b border-blue-400 resize-none"
        placeholder="Caption"
      />
      <div className="flex justify-between mt-4">
        <button onClick={onCancel} className="text-blue-400">Cancel</button>
        <button onClick={onSend} className="text-blue-400">Send</button>
      </div>
    </div>
  );
};
