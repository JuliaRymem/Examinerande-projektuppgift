const express = require('express');
const router = express.Router();
const { createNewOrder, getUserOrderHistory, deleteExistingOrder } = require('../controllers/orderController'); // r

// Skapa ny order
router.post('/create', createNewOrder);

// Hämta orderhistorik via userId (inte via användarnamn)
router.get('/history/:userId', getUserOrderHistory);

// Radera en specifik order
router.delete('/:orderId', deleteExistingOrder);

module.exports = router;

