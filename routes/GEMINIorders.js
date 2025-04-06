const express = require('express');
const router = express.Router();
const { createNewOrder, getUserOrderHistory, deleteExistingOrder } = require('../controllers/orderController');
const { validateNewOrder, validateOrderId } = require('../middleware/validateOrder');

// Skapa ny order
router.post('/create', validateNewOrder, createNewOrder);

// Hämta orderhistorik via userId (inte via användarnamn)
router.get('/history/:userId', (req, res, next) => {
  const userId = req.params.userId;
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({ error: 'Ogiltigt användar-ID i URL:en.' });
  }
  next();
}, getUserOrderHistory);

// Radera en specifik order
router.delete('/:orderId', validateOrderId, deleteExistingOrder);

module.exports = router;