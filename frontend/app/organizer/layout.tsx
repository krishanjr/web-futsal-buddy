import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import OrganizerSidebar from "@/components/organizer/OrganizerSidebar";

export default async function OrganizerAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.user.role === "admin") redirect("/admin");
  if (session.user.role === "player") redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <OrganizerSidebar user={session.user} />
      <main className="flex-1 px-8 py-8 max-w-6xl">{children}</main>
    </div>
  );
}
