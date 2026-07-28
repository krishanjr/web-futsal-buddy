"use client";

import { useEffect, useState, useTransition } from "react";
import {
  fetchMyNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notification-actions";
import { Notification } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetchMyNotificationsAction();
    if (res.success && res.data) {
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  function handleOpen() {
    setOpen((v) => !v);
    if (!open) load();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-50 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await markAllNotificationsReadAction();
                    await load();
                  })
                }
                className="text-xs text-green-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      if (!n.isRead) {
                        await markNotificationReadAction(n._id);
                        await load();
                      }
                    })
                  }
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                    n.isRead ? "" : "bg-green-50/50"
                  }`}
                >
                  <p className="text-xs text-gray-700">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
