// Importerar nödvändiga moduler och funktioner 
const express = require('express');
const router = express.Router();
const { createNewOrder, getUserOrderHistory, deleteExistingOrder } = require('../controllers/orderController');
const { validateNewOrder, validateOrderId } = require('../middleware/validateOrder');

// Skapar ny order med validering
router.post('/create', validateNewOrder, createNewOrder);

// Hämtar orderhistorik via userId (validerar att ett icke-tomt ID skickas med)
router.get('/history/:userId', (req, res, next) => {
  const userId = req.params.userId;
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({ error: 'Ogiltigt användar-ID i URL:en.' });
  }
  next();
}, getUserOrderHistory);

// Raderar en specifik order
router.delete('/:orderId', validateOrderId, deleteExistingOrder);

module.exports = router;