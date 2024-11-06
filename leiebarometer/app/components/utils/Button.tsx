// app/components/utils/Button.tsx

import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className = "",
  children,
  variant = "primary",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-2.5 font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-accent hover:bg-accent-dark text-white focus:ring-accent/50",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label={typeof children === "string" ? children : "Button"}
    >
      {children}
    </button>
  );
};

export default Button;
