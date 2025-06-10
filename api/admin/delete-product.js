export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
  
      const firebaseUrl = `${process.env.FIREBASE_PROJECT_ID}/products/${id}.json`;
  
      const response = await fetch(firebaseUrl, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Delete product error:', err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
  
