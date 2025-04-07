// Denna fil innehåller funktioner för att hantera ordrar i databasen

// Importerar nödvändiga moduler och databasanslutning 
const db = require("../database/database");

// Skapar en ny order i databasen och lägger till order_items 
const createNewOrder = (user_id, productSummary, totalAmount, items) => {
  return new Promise((resolve, reject) => {
    try {
      const orderStmt = db.prepare("INSERT INTO orders (user_id, product, amount) VALUES (?, ?, ?)"); // Skapar en ny order
      const numericTotalAmount = parseFloat(totalAmount);
      if (isNaN(numericTotalAmount)) { // Om totalbeloppet inte är ett giltigt nummer
        throw new Error("Totalbeloppet är ogiltigt.");
      }
      if (!user_id || typeof user_id !== "string") { // Om user_id saknas eller inte är en sträng
        throw new Error("user_id (UUID) saknas eller har fel format."); 
      }
      const orderResult = orderStmt.run(user_id, productSummary, numericTotalAmount); // Kör SQL-frågan 
      const orderId = orderResult.lastInsertRowid; // Hämtar det senaste insatta order-ID:t
      if (!orderId) {
        throw new Error("Kunde inte hämta orderId efter skapande."); // Om orderId inte kunde hämtas
      }
      const itemStmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)"); // Skapar order_items 
      db.transaction(() => { // Transaktion för att säkerställa att alla order_items skapas eller ingen görs
        items.forEach(item => { // Itererar över varje produkt i ordern
          const numericPrice = parseFloat(item.price); // Omvandlar priset till ett nummer
          if (isNaN(numericPrice)) {
            throw new Error(`Ogiltigt pris för produkt ${item.id}.`); // Om priset inte är ett giltigt nummer
          }
          itemStmt.run(orderId, item.id, item.quantity, numericPrice); // Skapar order_item
        });
      })();
      resolve({ orderId, productSummary, totalAmount }); // Returnerar orderId och sammanfattning
    } catch (err) {
      console.error("Error in createNewOrder:", err); //
      reject(err);
    }
  });
};

// Hämtar orderhistorik för en användare baserat på user_id 
const getUserOrderHistory = (user_id) => { 
  // Funktionen returnerar ett löfte (Promise)
  return new Promise((resolve, reject) => { 
    // SQL-frågan som ska köras. Den hämtar information om användarens ordrar.
    // Det är en flerradig sträng som innehåller själva frågan som skickas till databasen.
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
    // Här används db.prepare() för att förbereda SQL-frågan.
    try {
      const rows = db.prepare(query).all(user_id); // Kör SQL-frågan och hämtar alla rader som matchar frågan
      const history = rows.reduce((acc, row) => { // Reducerar raderna till en lista med ordrar
        let order = acc.find(o => o.orderId === row.orderId); // Hittar ordern i listan
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
    } catch (error) { // Om det uppstod ett fel under hämtningen
      console.error("Fel vid databashämtning av orderhistorik:", error); // Loggar felet
      reject(new Error("Fel vid hämtning av orderhistorik från databasen."));
    }
  });
};

// Raderar en order (och dess order_items via CASCADE) 
const deleteOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare("DELETE FROM orders WHERE id = ?"); // Raderar ordern
      const result = stmt.run(orderId); // Kör SQL-frågan
      if (result.changes > 0) { // Om ordern raderades
        resolve({ message: "Order raderad" });
      } else {
        reject(new Error("Order hittades inte")); // Om ingen order hittades
      }
    } catch (error) { // Om det uppstod ett fel under raderingen
      console.error("Fel vid radering av order:", error);
      reject(new Error("Kunde inte radera order från databasen.")); 
    }
  });
};

// Exporterar funktionerna för orderhantering 
module.exports = { createNewOrder, getUserOrderHistory, deleteOrder };

