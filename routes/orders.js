// Importerar nödvändiga moduler och funktioner 
const express = require('express'); 
const router = express.Router();
const { createNewOrder, getUserOrderHistory, deleteExistingOrder } = require('../controllers/orderController');

// Skapar ny order
router.post('/create', createNewOrder);

// Hämtar orderhistorik via userId (inte via användarnamn)
router.get('/history/:userId', getUserOrderHistory);

// Raderar en specifik order
router.delete('/:orderId', deleteExistingOrder);

// Exporterar routern för att kunna användas i appen 
module.exports = router;