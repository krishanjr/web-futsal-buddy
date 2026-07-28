import { Post } from "@/lib/types";

const typeLabels: Record<string, string> = {
  team_recruit: "Team Recruiting",
  player_seeking_team: "Player Seeking Team",
  opponent_request: "Opponent Wanted",
};

const typeColors: Record<string, string> = {
  team_recruit: "bg-blue-50 text-blue-700",
  player_seeking_team: "bg-purple-50 text-purple-700",
  opponent_request: "bg-orange-50 text-orange-700",
};

const statusColors: Record<string, string> = {
  open: "bg-green-50 text-green-700",
  filled: "bg-gray-100 text-gray-500",
  closed: "bg-gray-100 text-gray-400",
};

export default function PostCard({
  post,
  children,
}: {
  post: Post;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[post.postType]}`}
            >
              {typeLabels[post.postType]}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[post.status]}`}
            >
              {post.status}
            </span>
          </div>
          <p className="font-semibold text-gray-900">{post.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{post.city}</p>
        </div>
      </div>

      {post.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="capitalize px-2 py-0.5 rounded-full bg-gray-50">
          {post.skillLevel} level
        </span>
        {post.postType === "team_recruit" && (
          <>
            <span className="capitalize px-2 py-0.5 rounded-full bg-gray-50">
              {post.position} needed
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-50">
              {post.slotsNeeded} spot{post.slotsNeeded > 1 ? "s" : ""} open
            </span>
          </>
        )}
        {post.postType === "player_seeking_team" && (
          <span className="capitalize px-2 py-0.5 rounded-full bg-gray-50">
            Plays {post.position}
          </span>
        )}
        {post.postType === "opponent_request" && (
          <span className="px-2 py-0.5 rounded-full bg-gray-50">
            {post.venue} · {post.matchDate} at {post.matchTime}
          </span>
        )}
      </div>

      {children && <div className="pt-2 border-t border-gray-50">{children}</div>}
    </div>
  );
}
