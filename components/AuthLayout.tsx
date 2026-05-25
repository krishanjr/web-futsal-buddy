import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Brand header strip */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-green-100 px-6 py-3 flex items-center gap-2 z-10">
        <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            <path
              strokeLinecap="round"
              strokeWidth={1.5}
              d="M12 2v4m0 12v4M2 12h4m12 0h4"
            />
          </svg>
        </div>
        <span className="font-semibold text-green-800 text-lg tracking-tight">
          Futsal Buddy
        </span>
      </div>

      <div className="w-full max-w-md pt-16">{children}</div>
    </div>
  );
}
