import Head from "next/head";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import InputField from "@/components/InputField";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login – Futsal Buddy</title>
        <meta
          name="description"
          content="Sign in to your Futsal Buddy account and get back on the pitch."
        />
      </Head>

      <AuthLayout>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">
              Ready for the next match, Captain?
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" noValidate>
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="captain@collegiate.edu"
              autoComplete="email"
              required
            />

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-green-700 hover:text-green-900 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                Remember me for 30 days
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-semibold rounded-lg transition-colors text-sm mt-1"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New to the league?{" "}
              <Link
                href="/auth/register"
                className="text-green-700 hover:text-green-900 font-medium transition-colors"
              >
                Create an Account →
              </Link>
            </p>
          </div>
        </div>

        {/* Active players badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="flex gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block mt-0.5 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-green-700 inline-block mt-0.5" />
          </span>
          <span>+240 players active today</span>
        </div>
      </AuthLayout>
    </>
  );
}
