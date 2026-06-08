import { useState } from 'react';
import { LuCopy } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";

const copyToClipboard = async (text) => {
  // modern clipboard API
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // fallback for older mobile browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

const CopyPromptButton = ({ text = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="h-9 flex items-center gap-1.5 text-sm px-3 py-2 rounded-md
        border border-(--border-button) bg-(--bg-button) text-(--text-muted)
        hover:text-(--text-primary) transition-all duration-150 cursor-pointer"
    >
      {copied ? <FaCheck size={18} /> : <LuCopy size={18} />}
      {copied ? 'Copied' : 'Copy Prompt'}
    </button>
  );
};

export default CopyPromptButton;
