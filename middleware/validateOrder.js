// Middleware för att validera orderdata i Express.js-applikationen 
const validateNewOrder = (req, res, next) => {
  const { userId, items } = req.body;

  // Kontrollera att userId finns, är en sträng och inte tom
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({ error: 'Användar-ID måste anges.' });
  }

  // Kontrollera att items är en array med minst en produkt
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Ordern måste innehålla minst en produkt.' });
  }

  // Loopa igenom varje produkt i ordern och validera fälten
  for (const item of items) {
    // Kontrollera att varje produkt har ett giltigt ID (positivt heltal)
    if (!item.id || typeof item.id !== 'number' || item.id <= 0) {
      return res.status(400).json({ error: 'Varje produkt i ordern måste ha ett giltigt ID.' });
    }

    // Kontrollera att kvantiteten är ett positivt nummer
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ error: 'Kvantiteten för varje produkt måste vara ett positivt nummer.' });
    }

    // (Valfritt) Kontrollera att priset, om det anges, är ett icke-negativt nummer
    if (item.price !== undefined && (typeof item.price !== 'number' || item.price < 0)) {
      return res.status(400).json({ error: 'Priset för varje produkt måste vara ett icke-negativt nummer om det anges.' });
    }
  }

  // Om allt är OK, gå vidare till nästa middleware eller route-handler
  next();
};

// Middleware för att validera order-ID som skickas via URL:en  
const validateOrderId = (req, res, next) => {
  const orderId = req.params.orderId;

  // Kontrollera att order-ID finns, är ett heltal och större än 0
  if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
    return res.status(400).json({ error: 'Ogiltigt order-ID i URL:en.' });
  }

  // Om ID:t är giltigt, gå vidare till nästa steg
  next();
};

// Exportera middleware-funktionerna så att de kan användas i andra delar av applikationen 
module.exports = { validateNewOrder, validateOrderId };