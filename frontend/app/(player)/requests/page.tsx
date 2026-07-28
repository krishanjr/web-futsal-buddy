import {
  fetchOpenPostsAction,
  fetchMyPostsAction,
  fetchMyApplicationsAction,
} from "@/lib/actions/post-actions";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";
import ApplyForm from "@/components/posts/ApplyForm";
import PostApplicantsPanel from "@/components/posts/PostApplicantsPanel";
import MyApplicationRow from "@/components/posts/MyApplicationRow";

export default async function RequestsPage() {
  const [openPostsRes, myPostsRes, myApplicationsRes] = await Promise.all([
    fetchOpenPostsAction({ postType: "team_recruit" }),
    fetchMyPostsAction(),
    fetchMyApplicationsAction(),
  ]);

  const openPosts = openPostsRes.success ? openPostsRes.data || [] : [];
  const myPosts = myPostsRes.success ? myPostsRes.data || [] : [];
  const myApplications = myApplicationsRes.success ? myApplicationsRes.data || [] : [];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Post &amp; Apply</h1>
        <p className="text-sm text-gray-500 mt-1">
          Looking for a team? Post it. Or apply directly to teams that are recruiting.
        </p>
      </header>

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Post: Looking for a Team</h2>
            <CreatePostForm role="player" />
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Posts</h2>
            {myPosts.filter((p) => p.postType === "player_seeking_team").length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                You haven&apos;t posted anything yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {myPosts
                  .filter((p) => p.postType === "player_seeking_team")
                  .map((post) => (
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
            <h2 className="font-semibold text-gray-900 mb-4">Teams Recruiting Now</h2>
            {!openPostsRes.success ? (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {openPostsRes.message || "Failed to load open requests"}
              </div>
            ) : openPosts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No teams are recruiting right now.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {openPosts.map((post) => (
                  <PostCard key={post._id} post={post}>
                    <ApplyForm postId={post._id} />
                  </PostCard>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">My Applications</h2>
            {myApplications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                You haven&apos;t applied to any team yet.
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
