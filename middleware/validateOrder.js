/* ANVÄNDA DENNA NYA KOD? */

/* middleware/validateOrder.js
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
      if (item.price !== undefined && typeof item.price !== 'number' || (typeof item.price === 'number' && item.price < 0)) {
        return res.status(400).json({ error: 'Priset för varje produkt måste vara ett icke-negativt nummer om det anges.' });
      }
    }
  
    // Här borde vi egentligen också kontrollera att produkterna finns i menyn
    // och att priset stämmer. Eftersom vi inte har tillgång till menyn här,
    // kan vi antingen skicka med en funktion för att kolla menyn,
    // eller göra den kontrollen i controller-funktionen efter denna middleware.
  
    next();
  };
  
  const validateOrderId = (req, res, next) => {
    const orderId = req.params.orderId;
    if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
      return res.status(400).json({ error: 'Ogiltigt order-ID i URL:en.' });
    }
    next();
  };
  
  module.exports = { validateNewOrder, validateOrderId }; */