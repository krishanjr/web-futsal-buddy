"use client";

import { useTransition } from "react";
import { Futsal } from "@/lib/types";
import {
  verifyFutsalAction,
  unverifyFutsalAction,
  deleteAdminFutsalAction,
} from "@/lib/actions/admin-futsal-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default function FutsalsTable({ futsals }: { futsals: Futsal[] }) {
  const [pending, startTransition] = useTransition();

  if (futsals.length === 0) {
    return <p className="px-5 py-8 text-sm text-gray-400 text-center">No futsals found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
          <th className="px-5 py-3 font-medium">Name</th>
          <th className="px-5 py-3 font-medium">District</th>
          <th className="px-5 py-3 font-medium">Price/hr</th>
          <th className="px-5 py-3 font-medium">Status</th>
          <th className="px-5 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {futsals.map((f) => (
          <tr key={f._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
            <td className="px-5 py-3 font-medium text-gray-900">{f.name}</td>
            <td className="px-5 py-3 text-gray-600">{f.district}</td>
            <td className="px-5 py-3 text-gray-600">Rs. {f.pricePerHour}</td>
            <td className="px-5 py-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  f.isVerified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {f.isVerified ? "Verified" : "Pending"}
              </span>
              {!f.isActive && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  Inactive
                </span>
              )}
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-3">
                {f.isVerified ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(() => unverifyFutsalAction(f._id))}
                    className="text-xs font-medium text-gray-600 hover:text-yellow-700 transition-colors"
                  >
                    Unverify
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(() => verifyFutsalAction(f._id))}
                    className="text-xs font-medium text-green-700 hover:text-green-900 transition-colors"
                  >
                    Verify
                  </button>
                )}
                <DeleteButton
                  action={deleteAdminFutsalAction.bind(null, f._id)}
                  confirmText={`Delete futsal "${f.name}"? This cannot be undone.`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
