// Importerar en databasanslutning 
const db = require("../database/database");

// Klassen MenuModel innehåller metoder för att hantera menyalternativ i databasen 
class MenuModel { 
  static getAll() {
    return db.prepare("SELECT * FROM menu WHERE is_deleted = FALSE").all();
  }

  static getById(id) {
    return db.prepare("SELECT * FROM menu WHERE id = ? AND is_deleted = FALSE").get(id);
  }

  static create(title, desc, price) {
    const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
    return stmt.run(title, desc, price);
  }

  static update(id, title, desc, price) {
    const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
    return stmt.run(title, desc, price, id);
  }

  static delete(id) {
    const stmt = db.prepare("UPDATE menu SET is_deleted = TRUE WHERE id = ?");
    return stmt.run(id);
  }

  static restore(id) {
    const stmt = db.prepare("UPDATE menu SET is_deleted = FALSE WHERE id = ?");
    return stmt.run(id);
  }
}

// Exporterar klassen så att den kan användas i andra filer 
module.exports = MenuModel;



