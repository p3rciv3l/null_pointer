import { useState, useRef } from 'react';

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    clearCloseTimeout();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    clearCloseTimeout();

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return {
    isOpen,
    isHovered,
    handlers: {
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
    },
  };
};
