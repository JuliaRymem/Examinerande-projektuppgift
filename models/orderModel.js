// Importerar en databasanslutning 
const db = require("../database/database");

// Skapar en ny order i databasen och lägger till order_items
const createNewOrder = (user_id, productSummary, totalAmount, items) => {
  return new Promise((resolve, reject) => {
    const orderStmt = db.prepare("INSERT INTO orders (user_id, product, amount) VALUES (?, ?, ?)");
    let orderResult;
    try {
      const numericTotalAmount = parseFloat(totalAmount);
      if (isNaN(numericTotalAmount)) {
        throw new Error("Totalbeloppet är ogiltigt.");
      }
      if (!user_id || typeof user_id !== "string") {
        throw new Error("user_id (UUID) saknas eller har fel format.");
      }
      orderResult = orderStmt.run(user_id, productSummary, numericTotalAmount);
    } catch (err) {
      console.error("Fel vid infogning i orders:", err);
      if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return reject(new Error(`Användaren med ID ${user_id} finns inte.`));
      }
      return reject(new Error("Kunde inte skapa order (steg 1)."));
    }

    const orderId = orderResult.lastInsertRowid;
    if (!orderId) {
      return reject(new Error("Kunde inte hämta orderId efter skapande."));
    }

    const itemStmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)");
    try {
      // Använd en transaktion för att infoga alla order_items
      db.transaction(() => {
        items.forEach(item => {
          const numericPrice = parseFloat(item.price);
          if (isNaN(numericPrice)) {
            throw new Error(`Ogiltigt pris för produkt ${item.id}.`);
          }
          if (!item.id || typeof item.id !== "number") {
            throw new Error(`Produkt-ID måste vara ett nummer. (Fick: ${item.id})`);
          }
          itemStmt.run(orderId, item.id, item.quantity, numericPrice);
        });
      })();
    } catch (err) {
      console.error("Fel vid infogning av order-items:", err);
      try {
        db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);
      } catch (cleanupErr) {
        console.error("Kunde inte städa upp misslyckad order:", cleanupErr);
      }
      return reject(new Error("Fel vid infogning av order-items."));
    }

    resolve({ orderId, productSummary, totalAmount });
  });
};

// Hämtar orderhistorik för en användare baserat på user_id
const getUserOrderHistory = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        o.id AS orderId,
        o.user_id,
        o.product AS orderSummary,
        o.amount AS orderTotalAmount,
        o.created_at AS orderCreatedAt,
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
      const rows = db.prepare(query).all(user_id);
      const history = rows.reduce((acc, row) => {
        let order = acc.find(o => o.orderId === row.orderId);
        if (!order) {
          order = {
            orderId: row.orderId,
            userId: row.user_id,
            summary: row.orderSummary,
            totalAmount: row.orderTotalAmount,
            createdAt: row.orderCreatedAt,
            items: []
          };
          acc.push(order);
        }
        order.items.push({
          productId: row.product_id,
          title: row.product_title,
          quantity: row.quantity,
          priceAtOrder: row.price_at_order
        });
        return acc;
      }, []);

      resolve(history);
    } catch (error) {
      console.error("Fel vid databashämtning av orderhistorik:", error);
      reject(new Error("Fel vid hämtning av orderhistorik från databasen."));
    }
  });
};

// Raderar en order (och dess order_items via CASCADE)
const deleteOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare("DELETE FROM orders WHERE id = ?");
      const result = stmt.run(orderId);
      if (result.changes > 0) {
        resolve({ message: "Order raderad" });
      } else {
        reject(new Error("Order hittades inte"));
      }
    } catch (error) {
      console.error("Fel vid radering av order:", error);
      reject(new Error("Kunde inte radera order från databasen."));
    }
  });
};

module.exports = { createNewOrder, getUserOrderHistory, deleteOrder };


