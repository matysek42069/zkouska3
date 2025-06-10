export default async function handler(req, res) {
    if (req.method === 'DELETE') {
      const { orderId } = req.query;
  
      try {
        const firebaseUrl = `${process.env.FIREBASE_PROJECT_ID}/orders/${orderId}.json`;
        
        const response = await fetch(firebaseUrl, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete order');
        }
  
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Chyba při mazání objednávky:', error);
        res.status(500).json({ success: false, error: 'Failed to delete order' });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  }
