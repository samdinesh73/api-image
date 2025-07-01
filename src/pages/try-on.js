"use client";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        garm_img: "https://replicate.delivery/pbxt/KgwTlZyFx5aUU3gc5gMiKuD5nNPTgliMlLUWx160G4z99YjO/sweater.webp",
        human_img: "https://replicate.delivery/pbxt/KgwTlhCMvDagRrcVzZJbuozNJ8esPqiNAIJS3eMgHrYuHmW4/KakaoTalk_Photo_2024-04-04-21-44-45.png",
        garment_des: "cute pink top"
      })
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Virtual Try-On (VTON)</h1>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Try-On"}
      </button>

      {data && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <img src={data.output} alt="Output" width={400} />

          <h3 style={{ marginTop: 20 }}>Details</h3>
          <p><strong>Created At:</strong> {formatDate(data.created_at)}</p>
          <p><strong>Completed At:</strong> {formatDate(data.completed_at)}</p>
          <p><strong>Predict Time:</strong> {data.predict_time?.toFixed(2)} seconds</p>
          <p><strong>Total Time:</strong> {data.total_time?.toFixed(2)} seconds</p>
          <a href={data.web_url} target="_blank" rel="noopener noreferrer">
            View Logs
          </a>
        </div>
      )}
    </div>
  );
}
