/**
 * Vercel serverless function for handling iyzico payment callbacks
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📞 Received iyzico callback:', req.body);
    
    // Verify callback authenticity (implement signature verification)
    // For now, just log the callback data
    const { token, status, paymentId } = req.body;
    
    if (status === 'success') {
      console.log('✅ Payment successful:', { token, paymentId });
      // Here you would update your database to mark the order as paid
    } else {
      console.log('❌ Payment failed:', { token, status });
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('❌ Callback handling error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
}
