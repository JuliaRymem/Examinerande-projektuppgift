// Importerar en databasanslutning 
const db = require("../database/database");

// Skapar en ny användare i databasen 
const createUser = (id, name, email, hashedPassword) => { 
  try {
    const query = "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)"; // SQL-fråga för att skapa en ny användare
    const result = db.prepare(query).run(id, name, email, hashedPassword);
    return { id: result.lastInsertRowid, name, email }; // Hämtar det senaste insatta användar-ID:t
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  }
};

// Hämtar en användare baserat på e-postadress 
const findUserByEmail = (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    return db.prepare(query).get(email); // Hämtar användaren med angiven e-postadress
  } catch (err) {
    console.error("Error in findUserByEmail:", err);
    throw err;
  }
};

// Tar bort en användare och dess ordrar från databasen 
const deleteUserById = (id) => {
  try {
    db.transaction(() => {
      const deleteOrders = "DELETE FROM orders WHERE user_id = ?"; // Tar bort ordrar kopplade till användaren
      db.prepare(deleteOrders).run(id);
      const deleteUser = "DELETE FROM users WHERE id = ?"; // Tar bort användaren
      const result = db.prepare(deleteUser).run(id);
      if (result.changes === 0) {
        throw new Error('Användare hittades inte för radering.');
      }
    })();
    return { success: true }; // Bekräftar att användaren har tagits bort
  } catch (err) {
    console.error("Error in deleteUserById:", err); // 
    throw err;
  }
};

// Exporterar funktionerna för användarhantering 
module.exports = { createUser, findUserByEmail, deleteUserById };


