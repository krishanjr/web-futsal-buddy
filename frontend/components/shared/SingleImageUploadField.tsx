"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImageAction } from "@/lib/actions/upload-actions";

export default function SingleImageUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));

    startTransition(async () => {
      const res = await uploadImageAction(file);
      if (res.success && res.url) {
        setUrl(res.url);
      } else {
        setError(res.message || "Upload failed");
        setPreview(null);
      }
    });
  }

  const displayUrl = preview || url;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayUrl} alt={label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-xs">No photo</span>
          )}
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="text-xs font-medium bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          {pending ? "Uploading…" : displayUrl ? "Change Photo" : "Choose Photo"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-[11px] text-gray-400">JPG, PNG, WebP, or GIF. Max 5MB.</p>
    </div>
  );
}
