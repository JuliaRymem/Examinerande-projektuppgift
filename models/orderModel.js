// orderModel.js
const db = require("../database/database");

// Skapa en ny order
const createOrder = (userId, items, originalTotalPrice, discount, finalTotal) => { // Add parameters
    // No need for Promise wrapper with better-sqlite3
    try {
        // Use transaction for atomicity (insert into orders and order_items)
        db.transaction(() => {
            const orderStmt = db.prepare(`
                INSERT INTO orders (user_id, totalPrice, discount, finalTotal)
                VALUES (?, ?, ?, ?)
            `); // Add discount, finalTotal columns
            const result = orderStmt.run(userId, originalTotalPrice, discount, finalTotal); // Add values
            const orderId = result.lastInsertRowid;

            if (!orderId) {
                throw new Error("Kunde inte skapa order (fick inget orderId)");
            }

            // Lagra orderns produkter
            const insertItemStmt = db.prepare(`
                INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
                VALUES (?, ?, ?, ?)
            `); // Consider adding price_at_order
            items.forEach(item => {
                 // Use item.id and item.quantity from the detailed cart items
                 // Store the price *at the time of the order*
                insertItemStmt.run(orderId, item.id, item.quantity, item.price);
            });

            // If transaction successful, return orderId (or more info if needed)
            // Note: Cannot directly return from inside transaction in better-sqlite3 easily.
            // We rely on it throwing an error on failure.
            // Store orderId in a variable accessible outside if needed, or just return it here.
             global.lastOrderId = orderId; // Hacky way, better to restructure if possible

        })(); // Immediately execute the transaction

         return { orderId: global.lastOrderId }; // Return the ID

    } catch (error) {
        console.error("Database error in createOrder:", error);
        throw error; // Re-throw the error to be caught by the controller
    }
};

// Hämta orderhistorik för en användare
const getOrderHistory = (userId) => {
     // No need for Promise wrapper
    try {
        // Make sure column names (user_id, product_id, etc.) match your schema
         // Also fetch discount info if needed
        const query = `
            SELECT
                o.id AS orderId, o.totalPrice AS originalTotal, o.discount, o.finalTotal, o.created_at,
                oi.quantity, oi.price_at_order,
                m.title AS productTitle
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN menu m ON oi.product_id = m.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC, o.id, m.title`; // Added ordering

        const rows = db.prepare(query).all(userId);

        // Optional: Group results by orderId if desired
        const historyByOrder = {};
        rows.forEach(row => {
            if (!historyByOrder[row.orderId]) {
                historyByOrder[row.orderId] = {
                    orderId: row.orderId,
                    originalTotal: row.originalTotal,
                    discount: row.discount,
                    finalTotal: row.finalTotal,
                    createdAt: row.created_at,
                    items: []
                };
            }
            historyByOrder[row.orderId].items.push({
                title: row.productTitle,
                quantity: row.quantity,
                priceAtOrder: row.price_at_order
            });
        });

        return Object.values(historyByOrder); // Return array of orders

    } catch (error) {
        console.error("Database error in getOrderHistory:", error);
        throw error; // Re-throw
    }
};

// Radera en order (Keep as is, or use transaction)
const deleteOrder = (orderId) => {
    // No need for Promise wrapper
    try {
         db.transaction(() => {
            db.prepare("DELETE FROM order_items WHERE order_id = ?").run(orderId);
            const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);

            if (!result.changes) {
                 // Throw error inside transaction to cause rollback if order not found
                throw new Error("Order hittades inte");
            }
        })();
         return { message: "Order raderad" };
    } catch (error) {
         console.error("Database error in deleteOrder:", error);
         if (error.message === "Order hittades inte") {
             throw error; // Re-throw specific error
         }
         throw new Error("Kunde inte radera order"); // Generic error
    }
};


module.exports = { createOrder, getOrderHistory, deleteOrder };

/* Skapa en ny order
const createOrder = (userId, items) => {
    return new Promise((resolve, reject) => {
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const stmt = db.prepare("INSERT INTO orders (user_id, total_price) VALUES (?, ?)");
        const result = stmt.run(userId, totalPrice);
        const orderId = result.lastInsertRowid;

        if (!orderId) {
            return reject(new Error("Kunde inte skapa order"));
        }

        // Lagra orderns produkter
        const insertItemStmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)");
        items.forEach(item => {
            insertItemStmt.run(orderId, item.id, item.quantity);
        });

        resolve({ orderId, totalPrice });
    });
};

// Hämta orderhistorik för en användare
const getOrderHistory = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT orders.id, orders.total_price, orders.created_at,
                   menu.title, menu.price, order_items.quantity
            FROM orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN menu ON order_items.product_id = menu.id
            WHERE orders.user_id = ?`;

        const history = db.prepare(query).all(userId);
        resolve(history);
    });
};

// Radera en order
const deleteOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        db.prepare("DELETE FROM order_items WHERE order_id = ?").run(orderId);
        const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);

        if (result.changes) {
            resolve({ message: "Order raderad" });
        } else {
            reject(new Error("Order hittades inte"));
        }
    });
};

module.exports = { createOrder, getOrderHistory, deleteOrder }; */
