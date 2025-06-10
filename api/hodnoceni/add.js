// api/admin/ratings/add.js

// Používáme FIREBASE_PROJECT_ID, stejně jako vaše ostatní API routy
const FIREBASE_URL = process.env.FIREBASE_PROJECT_ID; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { stars, review } = req.body;

    if (!stars || isNaN(stars)) {
      return res.status(400).json({ error: 'Hodnocení (počet hvězdiček) je vyžadováno.' });
    }

    const response = await fetch(`${FIREBASE_URL}/ratings.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stars: parseInt(stars),
        review: review || '',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save rating to Firebase Realtime Database');
    }

    const result = await response.json();
    res.status(200).json({ success: true, id: result.name }); 
  } catch (error) {
    console.error('Chyba při ukládání hodnocení na serveru:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
}
