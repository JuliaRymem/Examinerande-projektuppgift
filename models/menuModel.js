//Denna fil innehåller funktioner för att hantera menyalternativ i databasen

// Importerar en databasanslutning 
const db = require("../database/database");

// Klassen MenuModel innehåller metoder för att hantera menyalternativ i databasen 
class MenuModel { 
  static getAll() {
    return db.prepare("SELECT * FROM menu WHERE is_deleted = FALSE").all();
  }
// Hämtar alla menyalternativ från databasen
  static getById(id) {
    return db.prepare("SELECT * FROM menu WHERE id = ? AND is_deleted = FALSE").get(id);
  }
// Hämtar ett menyalternativ baserat på dess ID
  static create(title, desc, price) {
    const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
    return stmt.run(title, desc, price);
  }
// Skapar ett nytt menyalternativ i databasen
  static update(id, title, desc, price) {
    const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
    return stmt.run(title, desc, price, id);
  }
// Uppdaterar ett befintligt menyalternativ i databasen
  static delete(id) {
    const stmt = db.prepare("UPDATE menu SET is_deleted = TRUE WHERE id = ?");
    return stmt.run(id);
  }
// Tar bort ett menyalternativ genom att sätta is_deleted till TRUE
  static restore(id) {
    const stmt = db.prepare("UPDATE menu SET is_deleted = FALSE WHERE id = ?");
    return stmt.run(id);
  }
}

// Exporterar klassen så att den kan användas i andra filer 
module.exports = MenuModel;



