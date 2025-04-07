// Middleware för att validera orderdata i Express.js-applikationen 
const validateNewOrder = (req, res, next) => {
  const { userId, items } = req.body;
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({ error: 'Användar-ID måste anges.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Ordern måste innehålla minst en produkt.' });
  }
  for (const item of items) {
    if (!item.id || typeof item.id !== 'number' || item.id <= 0) {
      return res.status(400).json({ error: 'Varje produkt i ordern måste ha ett giltigt ID.' });
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ error: 'Kvantiteten för varje produkt måste vara ett positivt nummer.' });
    }
    if (item.price !== undefined && (typeof item.price !== 'number' || item.price < 0)) {
      return res.status(400).json({ error: 'Priset för varje produkt måste vara ett icke-negativt nummer om det anges.' });
    }
  }
  next();
};

// Middleware för att validera order-ID i URL:en  
const validateOrderId = (req, res, next) => {
  const orderId = req.params.orderId;
  if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
    return res.status(400).json({ error: 'Ogiltigt order-ID i URL:en.' });
  }
  next();
};

// Exportera middleware-funktionerna så att de kan användas i andra delar av applikationen 
module.exports = { validateNewOrder, validateOrderId };