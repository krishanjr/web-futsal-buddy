import {
  fetchOpenPostsAction,
  fetchMyPostsAction,
  fetchMyApplicationsAction,
} from "@/lib/actions/post-actions";
import { fetchMyTeamsAction } from "@/lib/actions/organizer-team-actions";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";
import ApplyForm from "@/components/posts/ApplyForm";
import PostApplicantsPanel from "@/components/posts/PostApplicantsPanel";
import MyApplicationRow from "@/components/posts/MyApplicationRow";

export default async function OrganizerRequestsPage() {
  const [playerPostsRes, opponentPostsRes, myPostsRes, myApplicationsRes, myTeamsRes] =
    await Promise.all([
      fetchOpenPostsAction({ postType: "player_seeking_team" }),
      fetchOpenPostsAction({ postType: "opponent_request" }),
      fetchMyPostsAction(),
      fetchMyApplicationsAction(),
      fetchMyTeamsAction(),
    ]);

  const playerPosts = playerPostsRes.success ? playerPostsRes.data || [] : [];
  const opponentPosts = opponentPostsRes.success ? opponentPostsRes.data || [] : [];
  const myPosts = myPostsRes.success ? myPostsRes.data || [] : [];
  const myApplications = myApplicationsRes.success ? myApplicationsRes.data || [] : [];
  const myTeams = myTeamsRes.success ? myTeamsRes.data || [] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Post &amp; Apply</h1>
      <p className="text-sm text-gray-500 mt-1">
        Recruit players, find an opponent, or respond to requests from others.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col gap-6">
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Post a Request</h2>
            <CreatePostForm role="organizer" myTeams={myTeams} />
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Posts</h2>
            {myPosts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                You haven&apos;t posted any requests yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {myPosts.map((post) => (
                  <PostCard key={post._id} post={post}>
                    <PostApplicantsPanel post={post} />
                  </PostCard>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Players Looking for a Team</h2>
            {playerPosts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No players are looking for a team right now.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {playerPosts.map((post) => (
                  <PostCard key={post._id} post={post}>
                    <ApplyForm postId={post._id} myTeams={myTeams} />
                  </PostCard>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Teams Wanting a Match</h2>
            {opponentPosts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No opponent requests right now.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {opponentPosts.map((post) => (
                  <PostCard key={post._id} post={post}>
                    <ApplyForm postId={post._id} myTeams={myTeams} />
                  </PostCard>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Applications</h2>
            {myApplications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                You haven&apos;t applied to anything yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {myApplications.map((app) => (
                  <MyApplicationRow key={app._id} application={app} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
