export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { id, name, price } = req.body;
  
      if (!id || !name || isNaN(price)) {
        return res.status(400).json({ error: 'Neplatná data' });
      }
  
      const firebaseUrl = `${process.env.FIREBASE_PROJECT_ID}/products/${id}.json`;
  
      const response = await fetch(firebaseUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Edit product error:', err);
      res.status(500).json({ error: 'Failed to edit product' });
    }
  }  
  
