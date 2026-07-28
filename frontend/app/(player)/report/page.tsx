import ReportUserForm from "@/components/shared/ReportUserForm";

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Report a User</h1>
        <p className="text-sm text-gray-500 mt-1">
          Let us know if someone violated fair play or community guidelines.
        </p>
      </header>
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <ReportUserForm />
        </div>
      </div>
    </div>
  );
}
