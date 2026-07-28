import Link from "next/link";
import ChangePasswordForm from "@/components/player/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Update your account password.</p>
      <ChangePasswordForm />
      <Link
        href="/profile"
        className="inline-block mt-6 text-sm text-green-700 hover:text-green-900"
      >
        ← Back to Profile
      </Link>
    </div>
  );
}
