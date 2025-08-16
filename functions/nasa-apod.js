// functions/nasa-apod.js
export async function handler(event, context) {
  const apiKey = process.env.NASA_API_KEY; // API Key από το Netlify
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=5`; // τραβάμε 5 εικόνες τυχαία

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
