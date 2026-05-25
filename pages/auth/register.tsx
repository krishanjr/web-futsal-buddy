import Head from "next/head";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import InputField from "@/components/InputField";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Create Account – Futsal Buddy</title>
        <meta
          name="description"
          content="Join the premier collegiate futsal network. Create your profile and start finding competitive games today."
        />
      </Head>

      <AuthLayout>
        {/* Step indicator */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-400 px-1">
          <span className="font-semibold text-green-700 uppercase tracking-widest">
            Step 01 / 02
          </span>
          <span>Profile Setup</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full w-1/2 bg-green-600 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Let&apos;s build your profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Personalize your futsal experience to get the best game matches.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" noValidate>
            <InputField
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="Cristiano Ronaldo"
              autoComplete="name"
              required
            />

            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="striker@pitch.com"
              autoComplete="email"
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-semibold rounded-lg transition-colors text-sm mt-1"
            >
              Join the Pitch →
            </button>
          </form>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-gray-400">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-green-700 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-green-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Divider */}
          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-green-700 hover:text-green-900 font-medium transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="text-center">
            <p className="font-semibold text-gray-700 text-base">1.2k+</p>
            <p className="text-xs uppercase tracking-wide">Active Players</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="font-semibold text-gray-700 text-base">45</p>
            <p className="text-xs uppercase tracking-wide">Daily Matches</p>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
