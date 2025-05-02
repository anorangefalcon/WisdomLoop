import { ReactNode } from "react";

interface PopupProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Popup({ title, onClose, children }: PopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-[var(--bg-dark-secondary)] rounded-xl border border-[var(--border-color-dark)] shadow-lg w-full max-w-md mx-4 z-10">
        <div className="flex justify-between items-center border-b border-[var(--border-color-dark)] p-4">
          <h3 className="text-[var(--text-light)] text-lg font-medium">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
