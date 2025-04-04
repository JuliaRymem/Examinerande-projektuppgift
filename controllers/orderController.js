const db = require("../database/database");
const { validate: validateUUID } = require("uuid");

// Validerar att ett item har korrekt format
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

// Hämtar produktdetaljer och kontrollerar existens/pris (behåll eller integrera i middleware)
const getProductDetailsForCart = (items) => {
  // Se till att hämta priset som ett nummer (REAL/FLOAT)
   return items.map(item => {
    validateItem(item); // Validera format först
    const product = db
      .prepare("SELECT id, title, price FROM menu WHERE id = ? AND is_deleted = FALSE")
      .get(item.id);
    if (!product) {
      throw new Error(`Produkten med ID ${item.id} finns inte i menyn.`);
    }
    // Priskontroll: Jämför bara om pris skickats med (onödigt egentligen, lita på menypriset)
    if (item.hasOwnProperty("price") && parseFloat(item.price) !== parseFloat(product.price)) {
       throw new Error(`Felaktigt pris för produkten med ID ${item.id}. Förväntat: ${product.price}, Fick: ${item.price}`);
    } 
    // Returnera alltid priset från databasen
    return { ...item, price: parseFloat(product.price), name: product.title }; // Konvertera till float
  });
}; 

// Skapar en ny order
const createNewOrder = async (req, res) => {
  const { userId, items } = req.body;

  // Validera userId (ska vara UUID)
  if (!userId || typeof userId !== "string" || !validateUUID(userId)) {
    return res.status(400).json({ error: "Ogiltigt userId. Det måste vara en giltig UUID-sträng." });
  }

  // Validera att items är en icke-tom array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order måste innehålla minst en produkt." });
  }

  try {
    // Hämta produktdetaljer och *korrekta priser* från menyn
    const detailedItems = getProductDetailsForCart(items); // Denna validerar också item-format och existens

    // Skapa en sammanfattning av ordern
    const productSummary = detailedItems.map(item => `${item.name} (x${item.quantity})`).join(", ");

    // Beräkna totala beloppet baserat på *hämtade* priser
    const totalAmount = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Skapa ordern via modellen (skicka med UUID)
    const orderResult = await createNewOrder(userId, productSummary, totalAmount, detailedItems);

    res.status(201).json({
      message: "Order skapad.",
      orderId: orderResult.orderId,
      productSummary,
      totalAmount
    });
  } catch (error) {
    console.error("Fel vid skapande av order:", error);
    // Skicka tillbaka specifikt felmeddelande om möjligt (t.ex. från getProductDetailsForCart eller createOrder)
    res.status(400).json({ error: error.message || "Ett oväntat fel inträffade vid skapande av order." });
  }
};

// Hämtar orderhistorik för en användare
const getUserOrderHistory = async (req, res) => {
  const { userId } = req.params; // Hämta userId från URL:en

  // Validera att userId är ett giltigt UUID
  if (!uuidValidate(userId)) {
     return res.status(400).json({ error: "Ogiltigt userId i URL. Det måste vara ett UUID." });
  }

  try {
    const history = await getUserOrderHistory(userId); // Hämta via UUID
    // Skicka tillbaka tom array om ingen historik finns (Model hanterar detta)
    res.json(history);
  } catch (error) {
    console.error("Fel vid hämtning av orderhistorik:", error);
    res.status(500).json({ error: error.message || "Kunde inte hämta orderhistorik." });
  }
};

// Radera en specifik order
const deleteExistingOrder = async (req, res) => {
    const { orderId } = req.params;

    // Validera att orderId är ett nummer (INTEGER PRIMARY KEY i databasen)
    const numericOrderId = parseInt(orderId, 10);
    if (isNaN(numericOrderId) || numericOrderId <= 0) {
        return res.status(400).json({ error: "Ogiltigt orderId i URL. Det måste vara ett positivt heltal." });
    }

    try {
        await deleteOrder(numericOrderId);
        // Skicka tillbaka status 204 (No Content) för lyckad radering
        res.status(204).send();
    } catch (error) {
         console.error("Fel vid radering av order:", error);
         // Om modellen kastar "Order hittades inte" blir det 404, annars 500
         if (error.message === "Order hittades inte") {
             res.status(404).json({ error: error.message });
         } else {
             res.status(500).json({ error: "Kunde inte radera ordern." });
         }
    }
};

module.exports = { createNewOrder, getUserOrderHistory, deleteExistingOrder }; // Exportera deleteExistingOrder
