import { fetchUserByIdAction } from "@/lib/actions/admin-user-actions";
import EditUserForm from "./EditUserForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userResponse = await fetchUserByIdAction(id);

  if (!userResponse.success) {
    throw new Error(userResponse.message || "Failed to fetch user");
  }
  if (!userResponse.data) {
    throw new Error("No user data available");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
      <p className="text-sm text-gray-500 mt-1">
        Update role, status, and profile details.
      </p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <EditUserForm user={userResponse.data} />
      </div>
    </div>
  );
}
