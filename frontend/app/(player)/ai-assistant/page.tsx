import { fetchMyInsightsAction } from "@/lib/actions/ai-actions";
import AiChat from "@/components/player/AiChat";

export default async function AiAssistantPage() {
  const insightsRes = await fetchMyInsightsAction();
  const insights = insightsRes.success ? insightsRes.data : null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-8 py-6">
          <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ask Buddy about games, teams, or training.
          </p>
        </header>
        <div className="flex-1 px-8 py-6">
          <AiChat />
        </div>
      </div>

      <aside className="w-full lg:w-80 shrink-0 bg-white border-l border-gray-100 px-6 py-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Your Insights</h2>
        {!insightsRes.success ? (
          <p className="text-xs text-gray-400">
            {insightsRes.message ||
              "Complete your player profile to unlock personalized insights."}
          </p>
        ) : insights ? (
          <div className="flex flex-col gap-3">
            {insights.insight && (
              <p className="text-sm text-gray-600 bg-green-50 border border-green-100 rounded-lg p-3 whitespace-pre-line">
                {insights.insight}
              </p>
            )}
            {Array.isArray(insights.recommendations) &&
              insights.recommendations.map((tip, i) => (
                <p
                  key={i}
                  className="text-xs text-gray-500 border border-gray-100 rounded-lg p-3"
                >
                  {tip}
                </p>
              ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No insights yet.</p>
        )}
      </aside>
    </div>
  );
}
