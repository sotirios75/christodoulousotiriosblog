export default async function handler(req, res) {
  const { query } = req;
  const endpoint = query.endpoint || "planetary/apod";

  const params = new URLSearchParams(query);
  params.set("api_key", process.env.NASA_API_KEY);

  const url = `https://api.nasa.gov/${endpoint}?${params.toString()}`;
  const r = await fetch(url);
  const data = await r.json();

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.status(r.ok ? 200 : r.status).json(data);
}
