// Hanterar beställningar och beställningsinformation/rabatter

const express = require("express");
const router = express.Router();
const db = require("../database/database");
const { applyCampaign } = require("../controllers/campaignController"); // Importerar kampanjfunktionen

// Skapar en API för att skapa en ny beställning
router.post("/orders", (req, res) => {
  const { items, userId } = req.body; // Hämtar produkter och användar-ID från förfrågan

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Kundvagnen är tom" }); // Om kundvagnen är tom, returnera ett fel
  }

  let totalPrice = 0; // Startar med totalpriset på 0
  items.forEach((item) => {
    const product = db.prepare("SELECT * FROM menu WHERE id = ?").get(item.id); // Hämtar produkten från menytabellen
    if (!product) {
      return res.status(400).json({ error: `Produkten med ID ${item.id} hittades inte` }); // Om produkten inte finns, returnera ett fel
    }
    totalPrice += product.price * item.quantity; // Beräknar totalpriset för varje produkt
  });

  // Använder kampanjfunktionen för att beräkna rabatt
  const { discount, discountMessage } = applyCampaign(items); // Hämtar rabatt och rabattmeddelande
  const finalTotal = totalPrice - discount; // Beräknar slutpriset

  // Lägger in beställningen i databasen
  const orderId = db.prepare(`
    INSERT INTO orders (userId, totalPrice, discount, finalTotal)
    VALUES (?, ?, ?, ?)
  `).run(userId, totalPrice, discount, finalTotal).lastInsertRowid; // Sparar beställnings-ID

  // Lägger till varje produkt i ordern
  items.forEach((item) => {
    db.prepare("INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)")
      .run(orderId, item.id, item.quantity);
  });

// Skickar beställningsinformation tillbaka till användaren
  res.json({
    message: "Beställning genomförd!",
    orderId,
    originalTotal: totalPrice,
    discountApplied: discountMessage || "Ingen rabatt tillämpad",
    finalTotal,
  });
});

module.exports = router;
