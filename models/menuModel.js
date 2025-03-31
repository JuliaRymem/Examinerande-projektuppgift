const db = require("../database/database");

class MenuModel {
    static getAll() {
        return db.prepare("SELECT * FROM menu").all();
    }

static getById(id) {
    return db.prepare("SELECT FROM menu WHERE id = ?").get(id);
}

static create(title, desc, price) {
    const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
}

static update(id, title, desc, price) {
    const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
}

static delete(id) {
    const stmt = db.prepare("DELETE FROM menu WHERE id = ?");
    return stmt.run(id);
}
} 

module.exports = MenuModel;