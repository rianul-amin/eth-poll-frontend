"use client";
import React, { useState, useRef, useEffect } from "react";

interface ActionMenuProps {
  label?: string;
  svg: React.ReactNode;
  width: string;
  position?: "left" | "right";
  options: {
    label: string;
    section?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    dropdown?: React.ReactNode;
  }[];
}

const ActionMenu = ({
  options,
  width,
  svg,
  label,
  position = "right",
}: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="focus:outline-none flex items-center justify-center"
      >
        {svg}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          style={{ width }}
          className={`absolute top-full ${position}-0 mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[2px] rounded-[8px] z-40`}
        >
          <div className="bg-white rounded-[6px]">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 rounded-[8px] hover:rounded-[8px] cursor-pointer"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    option.onClick?.();
                  }}
                  className="flex items-center w-full text-left text-[#292D32] text-[14px] font-[500]"
                >
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 font-semibold">
                    {option.label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
