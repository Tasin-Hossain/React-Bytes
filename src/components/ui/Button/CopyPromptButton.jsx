import { useRef, useState } from 'react';
import gsap from 'gsap';
import { LuCopy } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa6';

const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
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
  const iconWrapRef = useRef(null);
  const btnRef = useRef(null);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);

      // flip animation on the icon wrapper
      gsap.timeline()
        .to(iconWrapRef.current, {
          rotateX: 90,
          duration: 0.18,
          ease: 'power1.in',
          onComplete: () => setCopied(true)
        })
        .to(iconWrapRef.current, {
          rotateX: 0,
          duration: 0.25,
          ease: 'back.out(2.5)'
        });

      gsap.fromTo(
        btnRef.current,
        { backgroundColor: 'rgba(16,185,129,0.15)' },
        { backgroundColor: 'rgba(0,0,0,0)', duration: 1.2, ease: 'power2.out' }
      );

      setTimeout(() => {
        gsap.timeline()
          .to(iconWrapRef.current, { rotateX: 90, duration: 0.18, ease: 'power1.in', onComplete: () => setCopied(false) })
          .to(iconWrapRef.current, { rotateX: 0, duration: 0.25, ease: 'back.out(2.5)' });
      }, 2000);
    } catch {
      // silent fail
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={handleCopy}
      style={{ perspective: 400 }}
      className="h-9 flex items-center gap-1.5 text-sm px-3 py-2 rounded-md truncate
        border border-(--border-button) bg-(--bg-button) text-(--text-muted)
        hover:text-(--text-primary) transition-colors duration-150 cursor-pointer"
    >
      <span ref={iconWrapRef} className="flex items-center" style={{ transformStyle: 'preserve-3d' }}>
        {copied ? <FaCheck size={18} /> : <LuCopy size={18} />}
      </span>
      Prompt
    </button>
  );
};

export default CopyPromptButton;