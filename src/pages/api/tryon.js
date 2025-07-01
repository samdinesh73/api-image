// /pages/api/tryon.js
import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.create({
      version:
        "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      input: {
        crop: false,
        seed: 42,
        steps: 30,
        category: "upper_body",
        force_dc: false,
        garm_img: req.body.garm_img,
        human_img: req.body.human_img,
        mask_only: false,
        garment_des: req.body.garment_des || "pink top",
      },
    });

    // Polling for prediction to complete
    let finalPrediction = prediction;
    const maxRetries = 40;
    let retryCount = 0;

    while (
      finalPrediction.status !== "succeeded" &&
      finalPrediction.status !== "failed" &&
      retryCount < maxRetries
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec wait
      finalPrediction = await replicate.predictions.get(finalPrediction.id);
      retryCount++;
    }

    if (finalPrediction.status !== "succeeded") {
      return res.status(500).json({ error: "Prediction failed or timed out." });
    }

    res.status(200).json({
      output: finalPrediction.output,
      created_at: finalPrediction.created_at,
      completed_at: finalPrediction.completed_at,
      predict_time: finalPrediction.metrics?.predict_time,
      total_time: finalPrediction.metrics?.total_time,
      logs: finalPrediction.logs,
      web_url: finalPrediction.urls?.web,
    });
  } catch (error) {
    console.error("Replicate error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
