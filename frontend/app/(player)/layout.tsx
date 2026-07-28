import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import PlayerSidebar from "@/components/player/PlayerSidebar";

export default async function PlayerGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "admin") redirect("/admin");
  if (session.user.role === "organizer") redirect("/organizer");

  return (
    <div className="flex min-h-screen">
      <PlayerSidebar user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
