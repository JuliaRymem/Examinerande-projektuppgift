// Importerar en databasanslutning 
const db = require("../database/database");

const createUser = (id, username, hashedPassword) => {
  try {
    const query = "INSERT INTO users (id, username, password) VALUES (?, ?, ?)";
    const result = db.prepare(query).run(id, username, hashedPassword);
    
     return { id: result.lastInsertRowid, username }; // Or use lastInsertRowid if ID is auto-gen
} catch (err) {
    console.error("Error in createUser:", err);
    throw err; // Re-throw for controller
}
};

const findUserByUsername = (username) => {
  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const row = db.prepare(query).get(username);
    return row; // Returns the user object or undefined
} catch (err) {
    console.error("Error in findUserByUsername:", err);
    throw err; // Re-throw
}
};

const deleteUserById = (id) => {
  try {
    // Use transaction
    db.transaction(() => {
       const deleteOrders = "DELETE FROM orders WHERE user_id = ?"; // ensure name is correct
       db.prepare(deleteOrders).run(id);

       const deleteUser = "DELETE FROM users WHERE id = ?";
       const result = db.prepare(deleteUser).run(id);

       if (result.changes === 0) {
           // Optional: Throw if user didn't exist to delete
           throw new Error('Användare hittades inte för radering.');
       }
   })(); // Execute transaction
    return { success: true };

} catch (err) {
   console.error("Error in deleteUserById:", err);
   throw err; // Re-throw
}
};

// funktioner
// createUser() Lägger till en ny användare
// findUserByUsername() Hämtar en användare baserat på användarnamn
// DeleteUserById() Tar bort både användaren och dess ordrar (viktigt för datarensning)
module.exports = {
  createUser,
  findUserByUsername,
  deleteUserById,
};
