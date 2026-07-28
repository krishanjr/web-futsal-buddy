"use client";

import { useActionState, useRef, useState } from "react";
import { uploadProfilePhotoAction, ActionResult } from "@/lib/actions/player-actions";

const initialState: ActionResult = { success: true };

export default function ProfilePhotoUpload({
  currentPhotoUrl,
  initials,
}: {
  currentPhotoUrl?: string | null;
  initials: string;
}) {
  const [state, formAction, pending] = useActionState(uploadProfilePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || currentPhotoUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="Profile photo" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          ref={inputRef}
          type="file"
          name="photo"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            Choose Photo
          </button>
          <button
            type="submit"
            disabled={pending || !preview}
            className="text-xs font-medium bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {pending ? "Uploading…" : "Save Photo"}
          </button>
        </div>
        {state.message && (
          <p className={`text-xs ${state.success ? "text-green-700" : "text-red-600"}`}>
            {state.message}
          </p>
        )}
        <p className="text-[11px] text-gray-400">JPG, PNG, WebP, or GIF. Max 5MB.</p>
      </div>
    </form>
  );
}
