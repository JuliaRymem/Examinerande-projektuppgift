/* ANVÄNDA DENNA NYA KOD? */

/* middleware/validateMenu.js
const validateMenuItem = (req, res, next) => {
    const { title, desc, price } = req.body;
  
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Titel måste anges.' });
    }
  
    if (!desc || typeof desc !== 'string' || desc.trim() === '') {
      return res.status(400).json({ error: 'Beskrivning måste anges.' });
    }
  
    if (price === undefined || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Pris måste vara ett icke-negativt nummer.' });
    }
  
    next();
  };
  
  const validateMenuItemId = (req, res, next) => {
    const itemId = req.params.id;
    if (!itemId || isNaN(parseInt(itemId)) || parseInt(itemId) <= 0) {
      return res.status(400).json({ error: 'Ogiltigt meny-ID i URL:en.' });
    }
    next();
  };
  
  module.exports = { validateMenuItem, validateMenuItemId }; */