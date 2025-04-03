const { createOrder, getOrderHistory } = require("../models/orderModel");
const { applyCampaign } = require("./campaignController"); // Import campaign logic NEW CODE
const db = require("../database/database"); // Keep for fetching product details if needed for campaign

// Helper function (you might already have one or need one) NEW CODE
// Assumes applyCampaign needs full item details including price NEW CODE
const getProductDetailsForCart = (items) => {
    const detailedItems = items.map(item => {
        const product = db.prepare("SELECT id, title, price FROM menu WHERE id = ?").get(item.id);
        if (!product) {
            throw new Error(`Product with ID ${item.id} not found during cart processing.`);
        }
        return { ...item, price: product.price, name: product.title }; // Add price and name needed by applyCampaign
    });
    return detailedItems;
  }

// Skapa ny order
const createNewOrder = async (req, res) => {
    const { userId, items } = req.body;

    // Validera att användare och produkter är angivna
    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "Order måste innehålla en användare och minst en produkt" });
    }

      try {
        // 1. Get full item details including current price for calculations
        const detailedCartItems = getProductDetailsForCart(items);

        // 2. Calculate original total price
        const originalTotalPrice = detailedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 3. Apply campaign logic
        const { discount, discountMessage } = applyCampaign(detailedCartItems); // Pass detailed items
        const finalTotal = originalTotalPrice - discount;

        // 4. Create order using the model
        // Pass all necessary info, including calculated values
        const orderResult = await createOrder(userId, detailedCartItems, originalTotalPrice, discount, finalTotal);

        // 5. Send response
        res.status(201).json({
            message: "Order skapad",
            orderId: orderResult.orderId,
            originalTotal: originalTotalPrice,
            discountApplied: discountMessage || "Ingen rabatt tillämpad",
            discountAmount: discount,
            finalTotal: finalTotal,
         });

        } catch (error) {
            console.error("Error creating order:", error);
            // Check for specific product not found error from helper function
             if (error.message.startsWith('Product with ID')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Kunde inte skapa order. Försök igen senare." });
        }
    };

    // Hämta orderhistorik för en användare
const getUserOrderHistory = async (req, res) => { // Mark as async if needed later
    try {
        const history = await getOrderHistory(req.params.userId); // Use await if model becomes async
        if (!history || history.length === 0) { // Check for null/undefined too
            // Send 200 with empty array or message instead of 404 if user exists but has no orders
             return res.status(200).json([]); // Or { message: "Ingen orderhistorik hittades" }
        }
        res.json(history);
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ error: "Kunde inte hämta orderhistorik. Försök igen senare." });
    }
};

module.exports = { createNewOrder, getUserOrderHistory };
    
    /* try {}
        // Här kan du lägga till en check för att se om användaren existerar i databasen
        const order = await createOrder(userId, items);
        res.status(201).json({ message: "Order skapad", order });
    } catch (error) {
        console.error("Error creating order:", error); // Logga felet för debugging
        res.status(500).json({ error: "Kunde inte skapa order. Försök igen senare." });
    }
}; */

/* Hämta orderhistorik för en användare
const getUserOrderHistory = async (req, res) => {
    try {
        const history = await getOrderHistory(req.params.userId);
        if (history.length === 0) {
            return res.status(404).json({ error: "Ingen orderhistorik hittades" });
        }
        res.json(history);
    } catch (error) {
        console.error("Error fetching order history:", error); // Logga felet för debugging
        res.status(500).json({ error: "Kunde inte hämta orderhistorik. Försök igen senare." });
    }
};

module.exports = { createNewOrder, getUserOrderHistory }; */


/*const { createOrder, getOrderHistory } = require("../models/orderModel");
const db = require("../database/database");  //provar...


// Skapa ny order
const createNewOrder = async (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "Order måste innehålla en användare och minst en produkt" });
    }

    try {
        const order = await createOrder(userId, items);
        res.status(201).json({ message: "Order skapad", order });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte skapa order" });
    }
};

// Hämta orderhistorik för en användare
const getUserOrderHistory = async (req, res) => {
    try {
        const history = await getOrderHistory(req.params.userId);
        if (history.length === 0) {
            return res.status(404).json({ error: "Ingen orderhistorik hittades" });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta orderhistorik" });
    }
};

module.exports = { createNewOrder, getUserOrderHistory }; */
