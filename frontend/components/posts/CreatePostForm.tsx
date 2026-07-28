"use client";

import { useActionState, useState } from "react";
import { createPostAction, ActionResult } from "@/lib/actions/post-actions";
import { AdminTeam } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function CreatePostForm({
  role,
  myTeams,
}: {
  role: "player" | "organizer";
  myTeams?: AdminTeam[];
}) {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);
  const [postType, setPostType] = useState<"team_recruit" | "opponent_request">("team_recruit");

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      {state.message && (
        <div
          className={`text-sm px-3 py-2 rounded-lg border ${
            state.success
              ? "text-green-700 bg-green-50 border-green-100"
              : "text-red-700 bg-red-50 border-red-100"
          }`}
        >
          {state.message}
        </div>
      )}

      {role === "player" ? (
        <input type="hidden" name="postType" value="player_seeking_team" />
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">What do you need?</label>
          <select
            name="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value as typeof postType)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="team_recruit">Recruit players for my team</option>
            <option value="opponent_request">Find an opponent for a match</option>
          </select>
        </div>
      )}

      {role === "organizer" && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Which team?</label>
          <select
            name="teamId"
            required
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a team…</option>
            {(myTeams || []).map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          {(!myTeams || myTeams.length === 0) && (
            <p className="text-xs text-amber-700">
              You need a team first — create one under My Teams.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          required
          minLength={3}
          placeholder={
            role === "player"
              ? "e.g. Midfielder looking for a competitive squad"
              : postType === "team_recruit"
              ? "e.g. Need 2 defenders for weekend league"
              : "e.g. Looking for a Saturday night friendly"
          }
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">City</label>
          <input
            name="city"
            required
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Skill Level</label>
          <select
            name="skillLevel"
            defaultValue="any"
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="any">Any</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {(role === "player" || postType === "team_recruit") && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              {role === "player" ? "Your Position" : "Position Needed"}
            </label>
            <select
              name="position"
              defaultValue="any"
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="goalkeeper">Goalkeeper</option>
              <option value="defender">Defender</option>
              <option value="midfielder">Midfielder</option>
              <option value="forward">Forward</option>
              <option value="any">Any</option>
            </select>
          </div>
          {role === "organizer" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Spots Open</label>
              <input
                name="slotsNeeded"
                type="number"
                min={1}
                max={20}
                defaultValue={1}
                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>
      )}

      {role === "organizer" && postType === "opponent_request" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Venue</label>
              <input
                name="venue"
                required
                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Max Players</label>
              <input
                name="maxPlayers"
                type="number"
                min={2}
                max={40}
                defaultValue={10}
                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                name="matchDate"
                type="date"
                required
                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input
                name="matchTime"
                type="time"
                required
                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {pending ? "Posting…" : "Post Request"}
      </button>
    </form>
  );
}
