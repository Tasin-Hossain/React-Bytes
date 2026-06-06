import { useState } from 'react';
import { LuCopy, LuCopyCheck } from "react-icons/lu";

const CopyPromptButton = ({ text = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
       className=" h-9 flex items-center gap-1.5 text-sm px-3 py-2 rounded-md
        border border-(--border-button) bg-(--bg-button) text-(--text-muted)
        hover:text-(--text-primary) transition-all duration-150 cursor-pointer"
    >
      {copied ? <LuCopyCheck size={18}/> : <LuCopy size={18}/>}
      {copied ? 'Copied!' : 'Copy Prompt'}
    </button>
  );
};

export default CopyPromptButton;
