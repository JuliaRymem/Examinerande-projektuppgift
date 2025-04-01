/* This code uses prepared statements to prevent SQL-injections... */

const db = require("../database/database");

class MenuModel {
    // Fetch all menu items
    static getAll() {
        try {
            return db.prepare("SELECT * FROM menu").all();
        } catch (error) {
            console.error("Fel vid hämtning av objekt på menyn:", error);
            return []; // Return an empty array if there's an error
        }
    }

// Fetch a single menu item by ID
static getById(id) {
    try {
        return db.prepare("SELECT * FROM menu WHERE id = ?").get(id);
    } catch (error) {
        console.error(`Fel vid hämtning av meny-objekt med ID ${id}:`, error);
        return null; // Return null if the item is not found or an error occurs
    }
}

// Create a new menu item
static create(title, desc, price) {
    try {
        const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
        return stmt.run(title, desc, price); // Execute the query
    } catch (error) {
        console.error("Fel vid skapande av nytt meny-objekt", error);
        return null; // Return null if there’s an error in creation
    }
}

// Update an existing menu item
static update(id, title, desc, price) {
    try {
        const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
        return stmt.run(title, desc, price, id); // Execute the query
    } catch (error) {
        console.error(`Fel vid uppdatering av meny-objekt med ID ${id}:`, error);
        return null; // Return null if the update fails
    }
}
 
// Delete a menu item by ID
static delete(id) {
    try {
        const stmt = db.prepare("DELETE FROM menu WHERE id = ?");
        return stmt.run(id); // Execute the query
    } catch (error) {
        console.error(`Fel vid radering av meny-objekt med ID ${id}:`, error);
        return null; // Return null if there’s an error in deletion
    }
}
}

module.exports = MenuModel;


/* This code uses prepared statements to prevent SQL-injections... */