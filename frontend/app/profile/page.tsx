import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { fetchMyAccountAction, fetchMyPlayerProfileAction } from "@/lib/actions/player-actions";
import AccountForm from "@/components/player/AccountForm";
import PlayerProfileForm from "@/components/player/PlayerProfileForm";
import ProfilePhotoUpload from "@/components/player/ProfilePhotoUpload";

export default async function ProfilePage() {
  const session = await getSession();
  const [accountRes, profileRes] = await Promise.all([
    fetchMyAccountAction(),
    session?.user.role === "player"
      ? fetchMyPlayerProfileAction()
      : Promise.resolve({ success: false as const, data: null, message: undefined }),
  ]);

  const account = accountRes.success ? accountRes.data : session?.user;
  const profile = profileRes.success ? profileRes.data : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Profile &amp; Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details.</p>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <ProfilePhotoUpload
            currentPhotoUrl={account?.profilePhoto}
            initials={`${account?.firstName?.[0] || ""}${account?.lastName?.[0] || ""}`}
          />
          <div>
            <p className="font-semibold text-gray-900">
              {account?.firstName} {account?.lastName}
            </p>
            <p className="text-sm text-gray-500">{account?.email}</p>
            <span className="inline-block mt-1 text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              {account?.role}
            </span>
          </div>
        </div>

        <AccountForm firstName={account?.firstName} lastName={account?.lastName} />
      </section>

      {session?.user.role === "player" && (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Player Profile</h2>
          <p className="text-xs text-gray-500 mb-4">
            This is what teammates and opponents see when they find you.
          </p>
          <PlayerProfileForm profile={profile} />
        </section>
      )}

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Account Security</h2>
        <p className="text-xs text-gray-500 mb-4">Update your password.</p>
        <Link
          href="/change-password"
          className="inline-block text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
        >
          Change Password
        </Link>
      </section>
    </div>
  );
}
