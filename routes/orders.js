const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderHistory,
} = require("../controllers/orderController");
const db = require("../database/database");  //provar...

// Skapa ny order
router.post("/create", createOrder);

// Hämta orderhistorik för en användare
router.get("/history/:userId", getOrderHistory);

module.exports = router;
