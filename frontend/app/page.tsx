import ReportUserForm from "@/components/shared/ReportUserForm";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Report a User</h1>
      <p className="text-sm text-gray-500 mt-1">
        Let us know if a player violated fair play or community guidelines.
      </p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-md">
        <ReportUserForm />
      </div>
    </div>
  );
}
