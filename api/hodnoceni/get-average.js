// api/admin/ratings/get-average.js

const FIREBASE_URL = process.env.FIREBASE_PROJECT_ID;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${FIREBASE_URL}/ratings.json`);

    if (!response.ok) {
      throw new Error('Failed to fetch ratings from Firebase Realtime Database');
    }

    const data = await response.json();

    let totalStars = 0;
    let numberOfRatings = 0;

    if (data) {
      Object.values(data).forEach(rating => {
        if (rating.stars) {
          totalStars += rating.stars;
          numberOfRatings++;
        }
      });
    }

    const average = numberOfRatings > 0 ? (totalStars / numberOfRatings).toFixed(1) : 0;

    res.status(200).json({
      average: parseFloat(average),
      count: numberOfRatings
    });
  } catch (error) {
    console.error('Chyba při načítání průměrného hodnocení na serveru:', error);
    res.status(500).json({ error: 'Failed to load average rating' });
  }
}
