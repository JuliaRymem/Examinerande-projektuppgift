// orderModel.js
const db = require("../database/database");

// Skapa en ny order
const createOrder = (user_id, items) => {
    return new Promise((resolve, reject) => {
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const stmt = db.prepare("INSERT INTO orders (user_id, total_price) VALUES (?, ?)");
        const result = stmt.run(user_id, totalPrice);
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
const getOrderHistory = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT orders.id, orders.total_price, orders.created_at,
                   menu.title, menu.price, order_items.quantity
            FROM orders
            JOIN order_items ON orders.id = order_items.order_id
            JOIN menu ON order_items.product_id = menu.id
            WHERE orders.user_id = ?`;

        const history = db.prepare(query).all(user_id);
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
