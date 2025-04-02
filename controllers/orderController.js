const { createOrder, getOrderHistory } = require("../models/orderModel");

// Skapa ny order
const createNewOrder = async (req, res) => {
    const { userId, items } = req.body;

    // Validera att användare och produkter är angivna
    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "Order måste innehålla en användare och minst en produkt" });
    }

    try {
        // Här kan du lägga till en check för att se om användaren existerar i databasen
        const order = await createOrder(userId, items);
        res.status(201).json({ message: "Order skapad", order });
    } catch (error) {
        console.error("Error creating order:", error); // Logga felet för debugging
        res.status(500).json({ error: "Kunde inte skapa order. Försök igen senare." });
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
        console.error("Error fetching order history:", error); // Logga felet för debugging
        res.status(500).json({ error: "Kunde inte hämta orderhistorik. Försök igen senare." });
    }
};

module.exports = { createNewOrder, getUserOrderHistory };


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
