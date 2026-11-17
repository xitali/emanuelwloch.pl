"use client";
import { useState } from "react";
import { upload } from "@vercel/blob/client";

export default function ProjectVideoUpload() {
  const [status, setStatus] = useState("");
  return <label className="block text-sm">Wgraj film MP4/WebM, do 25 MB<input className="block mt-2" type="file" accept="video/mp4,video/webm" onChange={async event => {
    const file = event.target.files?.[0];
    const form = event.currentTarget.closest("form");
    if (!file || !form) return;
    if (file.size > 25 * 1024 * 1024) { setStatus("Film przekracza 25 MB."); return; }
    setStatus("Przesyłanie filmu…");
    try {
      const extension = file.type === "video/webm" ? "webm" : "mp4";
      const blob = await upload(`projects/${crypto.randomUUID()}.${extension}`, file, { access: "public", handleUploadUrl: "/api/upload/direct", contentType: file.type });
      const field = form.querySelector<HTMLTextAreaElement>('[name="preview_video"]');
      if (field) field.value = blob.url;
      setStatus("Film przesłany. Dodaj obraz podglądu i zapisz projekt.");
    } catch { setStatus("Upload nie powiódł się. Sprawdź sesję administratora i spróbuj ponownie."); }
  }} /><span role="status">{status}</span></label>;
}
