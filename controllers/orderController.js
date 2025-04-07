// Importerar nödvändiga moduler och databasanslutning 
const db = require("../database/database");
const { validate: validateUUID } = require("uuid");
const { createNewOrder: createOrderModel, getUserOrderHistory: getOrderHistoryModel, deleteOrder } = require("../models/orderModel");
const { getCampaignByProduct } = require("../models/campaignModel");

// Hjälpfunktion för att validera ett orderitem
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

// Hämtar produktdetaljer från databasen
const getProductDetailsForCart = (items) => {
  return items.map(item => {
    validateItem(item);
    const product = db
      .prepare("SELECT id, title, price FROM menu WHERE id = ? AND is_deleted = FALSE")
      .get(item.id);
    if (!product) {
      throw new Error(`Produkten med ID ${item.id} finns inte i menyn.`);
    }
    if (item.hasOwnProperty("price") && parseFloat(item.price) !== parseFloat(product.price)) {
      throw new Error(`Felaktigt pris för produkten med ID ${item.id}. Förväntat: ${product.price}, Fick: ${item.price}`);
    }
    return { ...item, price: parseFloat(product.price), name: product.title };
  });
};

// Applicera kampanjrabatt på ett orderitem
const applyCampaignDiscount = (item) => {
  const campaign = getCampaignByProduct(item.id);
  if (!campaign) {
    return { discountedPrice: item.price, discount: 0 };
  }
  if (campaign.discountType === 'buy2get1') {
    const freeItems = Math.floor(item.quantity / 3);
    const discount = freeItems * item.price;
    return { discountedPrice: item.price, discount };
  }
  if (campaign.discountType === 'percentage') {
    const discount = item.price * (campaign.discountValue / 100) * item.quantity;
    const discountedPrice = item.price * (1 - campaign.discountValue / 100);
    return { discountedPrice, discount };
  }
  return { discountedPrice: item.price, discount: 0 };
};

// Skapar en ny order med full CRUD-funktionalitet 
const createNewOrder = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || typeof userId !== "string" || !validateUUID(userId)) {
    return res.status(400).json({ error: "Ogiltigt userId. Det måste vara en giltig UUID-sträng." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order måste innehålla minst en produkt." });
  }

  try {
    let detailedItems = getProductDetailsForCart(items);
    let totalDiscount = 0;
    detailedItems = detailedItems.map(item => {
      const { discountedPrice, discount } = applyCampaignDiscount(item);
      totalDiscount += discount;
      return { ...item, discountedPrice };
    });

    const productSummary = detailedItems.map(item => `${item.name} (x${item.quantity})`).join(", ");
    const subtotal = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = subtotal - totalDiscount;

    const orderResult = await createOrderModel(userId, productSummary, finalTotal, detailedItems);

    res.status(201).json({
      message: "Order skapad.",
      orderId: orderResult.orderId,
      productSummary,
      subtotal,
      totalDiscount,
      finalTotal
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