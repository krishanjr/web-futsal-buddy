import { fetchApplicationsForPostAction, closePostAction } from "@/lib/actions/post-actions";
import ApplicantRow from "./ApplicantRow";
import CloseButton from "./CloseButton";
import { Post } from "@/lib/types";

export default async function PostApplicantsPanel({ post }: { post: Post }) {
  const res = await fetchApplicationsForPostAction(post._id);
  const applications = res.success ? res.data || [] : [];

  return (
    <div className="mt-3 pt-3 border-t border-gray-50 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          {applications.length} applicant{applications.length === 1 ? "" : "s"}
        </p>
        {post.status !== "closed" && (
          <CloseButton action={closePostAction.bind(null, post._id)} />
        )}
      </div>
      {applications.length === 0 ? (
        <p className="text-xs text-gray-400">No applicants yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((app) => (
            <ApplicantRow key={app._id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
