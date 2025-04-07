// Middleware för att validera menyobjekt i en POST- eller PUT-förfrågan
const validateMenuItem = (req, res, next) => {
  const { title, desc, price } = req.body;

  // Kontrollera att 'title' finns, är en sträng och inte tom
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Titel måste anges.' });
  }

  // Kontrollera att 'desc' finns, är en sträng och inte tom
  if (!desc || typeof desc !== 'string' || desc.trim() === '') {
    return res.status(400).json({ error: 'Beskrivning måste anges.' });
  }

  // Kontrollera att 'price' finns, är ett nummer och inte negativt
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Pris måste vara ett icke-negativt nummer.' });
  }

  // Gå vidare till nästa middleware eller route-handler
  next();
};

// Middleware för att validera meny-ID som skickas via URL-parametern
const validateMenuItemId = (req, res, next) => {
  const itemId = req.params.id;

  // Kontrollera att ID finns, är ett heltal och större än 0
  if (!itemId || isNaN(parseInt(itemId)) || parseInt(itemId) <= 0) {
    return res.status(400).json({ error: 'Ogiltigt meny-ID i URL:en.' });
  }

  // Gå vidare till nästa middleware eller route-handler
  next();
};

// Exportera middleware-funktionerna för att kunna använda dem i routes eller controllers
module.exports = { validateMenuItem, validateMenuItemId };