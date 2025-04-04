const express = require("express");
const router = express.Router();
const {
  createNewOrder,
  getUserOrderHistory,
  deleteExistingOrder // Importera delete-funktionen
} = require("../controllers/orderController");

// POST /order/create - Skapa ny order
router.post("/create", createNewOrder);

// GET /order/history/:userId - Hämta orderhistorik för en användare (med UUID)
router.get("/history/:userId", getUserOrderHistory);

// DELETE /order/:orderId - Ta bort en specifik order
router.delete("/:orderId", deleteExistingOrder); // Lägg till delete-route

module.exports = { createNewOrder, getUserOrderHistory, deleteExistingOrder }; // Exportera deleteExistingOrder
module.exports = router;

