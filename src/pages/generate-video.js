import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        alert("No video URL received");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating video");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-center">
      <h1 className="text-2xl font-bold mb-6">🎥 AI Video Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your scene (e.g. a cat walking in Paris)"
        className="w-full max-w-md px-4 py-2 border rounded mb-4"
      />

      <br />

      <button
        onClick={generateVideo}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {videoUrl && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Output:</h2>
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            loop
            className="max-w-full mx-auto rounded shadow"
            style={{ width: "100%", maxWidth: "640px" }}
          />
        </div>
      )}
    </div>
  );
}
