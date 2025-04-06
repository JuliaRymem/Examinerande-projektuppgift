// Importerar nödvändiga moduler och databasanslutning 
const db = require("../database/database");
const { validate: validateUUID } = require("uuid");
const { createNewOrder: createOrderModel, getUserOrderHistory: getOrderHistoryModel, deleteOrder } = require("../models/ordermodel");

// Validerar att ett orderitem har korrekt format
const validateItem = (item) => {
  if (!item.id || typeof item.id !== "number") {
    throw new Error("Produkt-ID måste vara ett nummer.");
  }
  if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
    throw new Error("Produktens kvantitet måste vara ett positivt nummer.");
  }
  if (item.hasOwnProperty("price") && typeof item.price !== "number") {
    throw new Error("Produktens pris måste vara ett nummer.");
  }
};

// Hämtar produktdetaljer och kontrollerar att produkten existerar i menyn
const getProductDetailsForCart = (items) => {
  return items.map(item => {
    validateItem(item);
    const product = db
      .prepare("SELECT id, title, price FROM menu WHERE id = ? AND is_deleted = FALSE")
      .get(item.id);
    if (!product) {
      throw new Error(`Produkten med ID ${item.id} finns inte i menyn.`);
    }
    // Om pris skickas med kontrolleras det mot priset i databasen
    if (item.hasOwnProperty("price") && parseFloat(item.price) !== parseFloat(product.price)) {
       throw new Error(`Felaktigt pris för produkten med ID ${item.id}. Förväntat: ${product.price}, Fick: ${item.price}`);
    }
    return { ...item, price: parseFloat(product.price), name: product.title };
  });
};

// Skapar en ny order med full CRUD-funktionalitet
const createNewOrder = async (req, res) => {
  const { userId, items } = req.body;

  // Validera userId (måste vara en giltig UUID-sträng)
  if (!userId || typeof userId !== "string" || !validateUUID(userId)) {
    return res.status(400).json({ error: "Ogiltigt userId. Det måste vara en giltig UUID-sträng." });
  }
  // Validera att minst ett item finns i ordern
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order måste innehålla minst en produkt." });
  }

  try {
    // Hämtar och validerar detaljer för varje produkt
    const detailedItems = getProductDetailsForCart(items);

    // Skapar en summering av ordern
    const productSummary = detailedItems.map(item => `${item.name} (x${item.quantity})`).join(", ");
    // Beräknar totala orderbeloppet baserat på hämtade priser
    const totalAmount = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Skapar ordern i databasen via modellen
    const orderResult = await createOrderModel(userId, productSummary, totalAmount, detailedItems);

    res.status(201).json({
      message: "Order skapad.",
      orderId: orderResult.orderId,
      productSummary,
      totalAmount
    });
  } catch (error) {
    console.error("Fel vid skapande av order:", error);
    res.status(400).json({ error: error.message || "Ett oväntat fel inträffade vid skapande av order." });
  }
};

// Hämtar orderhistorik baserat på userId
const getUserOrderHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string" || !validateUUID(userId)) {
     return res.status(400).json({ error: "Ogiltigt userId i URL. Det måste vara ett UUID." });
  }

  try {
    const history = await getOrderHistoryModel(userId);
    res.json(history);
  } catch (error) {
    console.error("Fel vid hämtning av orderhistorik:", error);
    res.status(500).json({ error: error.message || "Kunde inte hämta orderhistorik." });
  }
};

// Raderar en specifik order
const deleteExistingOrder = async (req, res) => {
    const { orderId } = req.params;
    const numericOrderId = parseInt(orderId, 10);
    if (isNaN(numericOrderId) || numericOrderId <= 0) {
        return res.status(400).json({ error: "Ogiltigt orderId i URL. Det måste vara ett positivt heltal." });
    }
    try {
        await deleteOrder(numericOrderId);
        res.status(204).send();
    } catch (error) {
         console.error("Fel vid radering av order:", error);
         if (error.message === "Order hittades inte") {
             res.status(404).json({ error: error.message });
         } else {
             res.status(500).json({ error: "Kunde inte radera ordern." });
         }
    }
};

// Exporterar funktionerna för användning i routes
module.exports = { createNewOrder, getUserOrderHistory, deleteExistingOrder };

