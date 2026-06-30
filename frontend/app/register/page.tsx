import type { Metadata } from "next";
import AuthLayout from "@/components/AuthLayout";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account – Futsal Buddy",
  description: "Join the premier collegiate futsal network.",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Join the league
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create your account and find your next match.
          </p>
        </div>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
}
