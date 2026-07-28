"use client";

import { useState, useTransition } from "react";
import { reviewApplicationAction } from "@/lib/actions/post-actions";
import { Application } from "@/lib/types";

export default function ApplicantRow({ application }: { application: Application }) {
  const [status, setStatus] = useState(application.status);
  const [matchId, setMatchId] = useState<string | undefined>(undefined);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function review(action: "accept" | "reject") {
    setError("");
    startTransition(async () => {
      const res = await reviewApplicationAction(application._id, action);
      if (!res.success) {
        setError(res.message || "Something went wrong");
        return;
      }
      setStatus(action === "accept" ? "accepted" : "rejected");
      if (res.data?.matchId) setMatchId(res.data.matchId);
    });
  }

  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900 capitalize">
          {application.applicantRole} applicant
        </p>
        {application.message && (
          <p className="text-xs text-gray-500 mt-0.5">&ldquo;{application.message}&rdquo;</p>
        )}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      {status === "pending" ? (
        <div className="flex items-center gap-2">
          <button
            disabled={pending}
            onClick={() => review("accept")}
            className="text-xs font-medium bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Accept
          </button>
          <button
            disabled={pending}
            onClick={() => review("reject")}
            className="text-xs font-medium bg-gray-100 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${
              status === "accepted"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status}
          </span>
          {matchId && (
            <a
              href={`/organizer/matches/${matchId}`}
              className="text-xs font-medium text-green-700 hover:text-green-900 underline"
            >
              View Match →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
