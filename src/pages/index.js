import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <a href="./generate-video">Generate video</a>
      <a href="./try-on">Try on</a>
      <a href="./try-on1">Working Code</a>
    </div>
  );
}
