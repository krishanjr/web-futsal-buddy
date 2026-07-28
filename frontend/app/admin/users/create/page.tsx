import CreateUserForm from "./CreateUserForm";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
      <p className="text-sm text-gray-500 mt-1">Add a new player, organizer, or admin.</p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <CreateUserForm />
      </div>
    </div>
  );
}
