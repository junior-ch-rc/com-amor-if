import React, { useState } from "react";
import clsx from "clsx";

const MessageBox = ({ message, color = "detail", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        "fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full p-4 border-l-4 shadow-lg rounded-md z-50",
        `bg-${color}`,
        `border-${color}`
      )}
    >
      <div className="flex items-start">
        <div className="flex-grow">
          <p className="text-sm leading-relaxed break-words max-h-40 overflow-y-auto">
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className={clsx(
            "ml-4",
            `hover:text-${color}-dark`,
            "focus:outline-none"
          )}
          aria-label="Close"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
