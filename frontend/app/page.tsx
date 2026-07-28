"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/futsal-buddy-logo.png" alt="Futsal Buddy" width={32} height={32} />
            <span className="text-xl font-bold text-green-700">Futsal Buddy</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-gray-600 hover:text-green-700">Login</Link>
            <Link href="/register" className="text-gray-600 hover:text-green-700">Register</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Opponents. Search Teammates. Play Futsal.</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Futsal Buddy is the collegiate futsal league management platform. Find players, organize teams, book courts, and dominate the court.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">Get Started</Link>
          <Link href="/login" className="inline-block border border-gray-300 bg-white px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">Sign In</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Players</h3>
            <p className="text-gray-600 text-sm">Search for teammates or opponents by position, skill level, city, and availability.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Teams</h3>
            <p className="text-gray-600 text-sm">Organize your squad, manage members, and compete in matches and tournaments.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Courts</h3>
            <p className="text-gray-600 text-sm">Find and book futsal venues near you with real-time availability and pricing.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600 text-sm">Get AI-powered suggestions for player improvement, match tips, and team strategy.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Matches</h3>
            <p className="text-gray-600 text-sm">Join open matches, create your own, or set up challenges between teams.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaderboards</h3>
            <p className="text-gray-600 text-sm">Track your stats, compare with others, and climb the rankings.</p>
          </div>
        </div>
      </section>
    </div>
  );
}