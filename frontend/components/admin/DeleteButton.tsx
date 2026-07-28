"use client";

interface DeleteButtonProps {
  action: () => Promise<unknown> | unknown;
  label?: string;
  confirmText?: string;
}

export default function DeleteButton({ action, label = "Delete", confirmText }: DeleteButtonProps) {
  const handleClick = () => {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }
    void action();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
    >
      {label}
    </button>
  );
}
