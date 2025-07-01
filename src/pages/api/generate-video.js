import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { prompt } = req.body;

    const output = await replicate.run("minimax/video-01", {
      input: {
        prompt,
        prompt_optimizer: true,
      },
    });

    // If output is an array, return first element
    const videoUrl = Array.isArray(output) ? output[0] : output;

    res.status(200).json({ videoUrl });
  } catch (err) {
    console.error("Replicate error:", err);
    res.status(500).json({ error: err.message });
  }
}
