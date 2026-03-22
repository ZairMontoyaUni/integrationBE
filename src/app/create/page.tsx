"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";

type Tab = "post" | "reel";

export default function CreatePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("post");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [audioTrack, setAudioTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadedUrl) {
      setError("Upload a file first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response: Response;

      if (tab === "post") {
        response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl, caption, location }),
        });
      } else {
        response = await fetch("/api/reels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: uploadedUrl,
            thumbnailUrl: uploadedUrl,
            caption,
            audioTrack,
          }),
        });
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Could not create content");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["post", "reel"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPreview(null);
              setUploadedUrl(null);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-square overflow-hidden">
          {preview ? (
            tab === "post" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={preview}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400 p-8 text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="font-semibold text-sm">Click to select a file</p>
              <p className="text-xs">
                {tab === "post" ? "JPEG, PNG, WEBP" : "MP4, MOV"}
              </p>
              <div className="w-full">
                <UploadDropzone
                  endpoint={tab === "post" ? "imageUploader" : "videoUploader"}
                  onUploadBegin={() => {
                    setUploading(true);
                    setError(null);
                  }}
                  onClientUploadComplete={(files) => {
                    setUploading(false);

                    const file = files[0] as
                      | {
                          ufsUrl?: string;
                          url?: string;
                          serverData?: { url?: string };
                        }
                      | undefined;

                    const mediaUrl =
                      file?.ufsUrl ?? file?.url ?? file?.serverData?.url;
                    if (!mediaUrl) {
                      setError("Upload finished but no file URL was returned.");
                      return;
                    }

                    setUploadedUrl(mediaUrl);
                    setPreview(mediaUrl);
                    setError(null);
                  }}
                  onUploadError={(uploadError: Error) => {
                    setUploading(false);
                    setError(uploadError.message);
                  }}
                  appearance={{
                    container:
                      "w-full border-0 bg-transparent px-4 pb-2 pt-0 min-h-0",
                    button:
                      "ut-ready:bg-blue-500 ut-ready:hover:bg-blue-600 ut-uploading:bg-blue-500/70",
                    allowedContent: "text-gray-400",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-blue-400 transition-colors"
            required
          />
        </div>

        {tab === "post" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add a location"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {tab === "reel" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Audio track (optional)
            </label>
            <input
              type="text"
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              placeholder="e.g. Golden Hour — JVKE"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading || uploading || !caption.trim() || !uploadedUrl}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40"
        >
          {uploading ? "Uploading..." : loading ? "Sharing..." : `Share ${tab}`}
        </button>
      </form>
    </div>
  );
}
