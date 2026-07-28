import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-green-100 px-6 py-3 flex items-center gap-2 z-10">
        <img src="/futsal-buddy-logo.png" alt="Futsal Buddy" className="w-16 h-16" />
        <span className="font-semibold text-green-800 text-lg tracking-tight">
          Futsal Buddy
        </span>
      </div>

      <div className="w-full max-w-md pt-24">{children}</div>
    </div>
  );
}
