import Link from "next/link";
import { fetchFutsalsAction } from "@/lib/actions/player-actions";
import CounterChallengeForm from "../../_components/CounterChallengeForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const futsalsRes = await fetchFutsalsAction({});
  const futsals = futsalsRes.success ? futsalsRes.data || [] : [];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <Link href="/challenges" className="text-xs text-gray-500 hover:text-green-700">
          ← Back to Challenges
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Counter Offer</h1>
        <p className="text-sm text-gray-500 mt-1">Propose a different date, time, or ground.</p>
      </header>
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-lg">
          <CounterChallengeForm challengeId={id} futsals={futsals} />
        </div>
      </div>
    </div>
  );
}
