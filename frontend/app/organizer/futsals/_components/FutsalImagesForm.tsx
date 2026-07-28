"use client";

import { useRef, useState, useTransition } from "react";
import {
  addFutsalImagesAction,
  removeFutsalImageAction,
} from "@/lib/actions/organizer-futsal-actions";
import { uploadImageAction } from "@/lib/actions/upload-actions";

export default function FutsalImagesForm({
  futsalId,
  images,
}: {
  futsalId: string;
  images: string[];
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removing, startRemoving] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFilesChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setUploading(true);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1} of ${files.length}…`);
      const res = await uploadImageAction(files[i]);
      if (res.success && res.url) {
        uploadedUrls.push(res.url);
      } else {
        setError(`"${files[i].name}" failed to upload: ${res.message || "unknown error"}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setProgress("Saving…");
      const saveRes = await addFutsalImagesAction(futsalId, uploadedUrls);
      if (!saveRes.success) {
        setError(saveRes.message || "Failed to save photos");
      }
    }

    setProgress(null);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {images.length === 0 ? (
        <p className="text-sm text-gray-400 mb-4">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {images.map((url) => (
            <div key={url} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Futsal ground"
                className="w-full h-24 object-cover rounded-lg border border-gray-100"
              />
              <button
                type="button"
                disabled={removing}
                onClick={() =>
                  startRemoving(() => {
                    void removeFutsalImageAction(futsalId, url);
                  })
                }
                className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        onChange={handleFilesChosen}
        className="hidden"
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-medium transition-colors"
      >
        {uploading ? progress || "Uploading…" : "Upload Photos"}
      </button>
      <p className="text-[11px] text-gray-400 mt-2">
        Pick one or more photos from your device. JPG, PNG, WebP, or GIF, up to 5MB each.
      </p>
    </div>
  );
}
