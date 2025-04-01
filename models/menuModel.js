const db = require("../database/database");

class MenuModel {
    // Fetch all objects that isn't deleted
    static getAll() {
        return db.prepare("SELECT * FROM menu WHERE is_deleted = FALSE").all();
    }

    // Get an object that isn't removed
    static getById(id) {
        return db.prepare("SELECT * FROM menu WHERE id = ? AND is_deleted = FALSE").get(id);
    }

    // Create a new object
    static create(title, desc, price) {
        const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
        return stmt.run(title, desc, price);
    }

    // Update an object
    static update(id, title, desc, price) {
        const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
        return stmt.run(title, desc, price, id);
    }

    // "Soft deleting" (is_deleted = TRUE)
    static delete(id) {
        const stmt = db.prepare("UPDATE menu SET is_deleted = TRUE WHERE id = ?");
        return stmt.run(id);
    }

    // Restore an object (is_deleted = FALSE)
    static restore(id) {
        const stmt = db.prepare("UPDATE menu SET is_deleted = FALSE WHERE id = ?");
        return stmt.run(id);
    }
}

module.exports = MenuModel;