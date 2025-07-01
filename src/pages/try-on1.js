"use client";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [garmImage, setGarmImage] = useState(null);
  const [humanImage, setHumanImage] = useState(null);
  const [garmUrl, setGarmUrl] = useState(null);
  const [humanUrl, setHumanUrl] = useState(null);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://api.imgbb.com/1/upload?key=664fea7895e8f43a31fd6caecced9756", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    return json.data.url;
  };

  const handleGenerate = async () => {
    if (!garmImage || !humanImage) {
      alert("Please upload both images.");
      return;
    }

    setLoading(true);
    try {
      const [garmUrlUploaded, humanUrlUploaded] = await Promise.all([
        uploadToImgBB(garmImage),
        uploadToImgBB(humanImage),
      ]);

      setGarmUrl(garmUrlUploaded);
      setHumanUrl(humanUrlUploaded);

      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garm_img: garmUrlUploaded,
          human_img: humanUrlUploaded,
          garment_des: "cute pink top",
        }),
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error uploading or processing:", err);
      alert("Something went wrong. Check console.");
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Virtual Try-On (VTON)</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          Upload Garment Image:
          <input type="file" accept="image/*" onChange={(e) => setGarmImage(e.target.files[0])} />
        </label>
        {garmImage && <img src={URL.createObjectURL(garmImage)} alt="Garment" width={150} />}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Upload Human Image:
          <input type="file" accept="image/*" onChange={(e) => setHumanImage(e.target.files[0])} />
        </label>
        {humanImage && <img src={URL.createObjectURL(humanImage)} alt="Human" width={150} />}
      </div>

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
          <a href={data.web_url} target="_blank" rel="noopener noreferrer">View Logs</a>
        </div>
      )}
    </div>
  );
}
