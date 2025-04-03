const express = require("express");
const router = express.Router();
// new code
const {
  createNewOrder, // Changed from createOrder
  getUserOrderHistory, // Changed from getOrderHistory
} = require("../controllers/orderController");

/*const {
  createOrder,
  getOrderHistory,
} = require("../controllers/orderController"); */

// Skapa ny order
router.post("/create", createNewOrder); // Use the imported function

// Hämta orderhistorik för en användare
router.get("/history/:userId", getUserOrderHistory); // Use the imported function

module.exports = router;
