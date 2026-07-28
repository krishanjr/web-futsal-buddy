import { fetchPostByIdAction } from "@/lib/actions/post-actions";
import { Application } from "@/lib/types";
import WithdrawButton from "./WithdrawButton";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

export default async function MyApplicationRow({ application }: { application: Application }) {
  const postRes = await fetchPostByIdAction(application.postId);
  const post = postRes.success ? postRes.data : null;

  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {post ? post.title : "Post no longer available"}
        </p>
        {post && <p className="text-xs text-gray-500 mt-0.5">{post.city}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${statusColors[application.status]}`}
        >
          {application.status}
        </span>
        {application.status === "pending" && <WithdrawButton applicationId={application._id} />}
      </div>
    </div>
  );
}
