"use client";

export default function CreateUserForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input name="email" className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>
      <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-white">
        Create user
      </button>
    </form>
  );
}
