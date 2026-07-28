import { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  action?: (...args: any[]) => unknown;
  label?: string;
  children?: ReactNode;
}

export default function ActionButton({
  variant = "default",
  label,
  children,
  action,
  ...props
}: ActionButtonProps) {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
  };

  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${variants[variant]}`}
      {...props}
    >
      {label || children}
    </button>
  );
}