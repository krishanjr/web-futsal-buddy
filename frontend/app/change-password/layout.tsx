import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import PlayerSidebar from "@/components/player/PlayerSidebar";
import OrganizerSidebar from "@/components/organizer/OrganizerSidebar";
import Sidebar from "@/components/admin/Sidebar";

export default async function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { role } = session.user;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {role === "admin" ? (
        <Sidebar user={session.user} />
      ) : role === "organizer" ? (
        <OrganizerSidebar user={session.user} />
      ) : (
        <PlayerSidebar user={session.user} />
      )}
      <main className="flex-1 px-8 py-8 max-w-md">{children}</main>
    </div>
  );
}
