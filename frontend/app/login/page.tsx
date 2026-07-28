import type { Metadata } from "next";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login – Futsal Buddy",
  description: "Sign in to your Futsal Buddy account and get back on the pitch.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ready for the next match, Captain?
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
