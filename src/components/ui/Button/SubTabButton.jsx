const SubTabButton = ({ active, onClick, children, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 h-9 rounded-md text-sm font-medium transition-all duration-150 border border-(--border-button)
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : `cursor-pointer ${active ? 'bg-(--bg-button) text-(--text-primary)' : 'text-(--text-muted) hover:text-(--text-primary)'}`
        }`}
    >
      {children}
    </button>
  );
};

export default SubTabButton;