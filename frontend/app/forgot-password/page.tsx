import type { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import ForgotPasswordForm from "@/components/player/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password – Futsal Buddy",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a 6-digit reset code.
          </p>
        </div>
        <ForgotPasswordForm />
        <div className="pt-4 mt-4 border-t border-gray-100 text-center">
          <Link href="/login" className="text-sm text-green-700 hover:text-green-900 font-medium">
            ← Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
