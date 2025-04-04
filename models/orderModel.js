const db = require("../database/database");

// Skapar en ny order i tabellen orders och sparar detaljer i order_items
const createOrder = (user_id, productSummary, totalAmount, items) => {
  return new Promise((resolve, reject) => {
    // Infoga en ny order med användar-id, en sammanfattning av produkterna och det totala beloppet
    const orderStmt = db.prepare("INSERT INTO orders (user_id, product, amount) VALUES (?, ?, ?)");
    const orderResult = orderStmt.run(user_id, productSummary, totalAmount);
    const orderId = orderResult.lastInsertRowid;
    if (!orderId) {
      return reject(new Error("Kunde inte skapa order"));
    }
    
    // Infoga detaljer per produkt i order_items med pris vid ordertillfället
    const itemStmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)");
    try {
      items.forEach(item => {
        itemStmt.run(orderId, item.id, item.quantity, item.price);
      });
    } catch (err) {
      return reject(new Error("Fel vid infogning av order-items"));
    }
    
    resolve({ orderId, productSummary, totalAmount });
  });
};

// Hämtar orderhistorik för en användare med hjälp av en JOIN mellan orders, order_items och menu
const getOrderHistory = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        o.id AS orderId, 
        o.user_id, 
        o.product, 
        o.amount, 
        o.created_at,
        oi.product_id, 
        oi.quantity, 
        oi.price_at_order, 
        m.title AS product_title
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menu m ON oi.product_id = m.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    try {
      const history = db.prepare(query).all(user_id);
      resolve(history);
    } catch (error) {
      reject(new Error("Fel vid hämtning av orderhistorik"));
    }
  });
};

module.exports = { createOrder, getOrderHistory };

/* orderModel.js
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
