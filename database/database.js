// Skapar en SQLite-databas med Better-SQLite3 och definierar tabeller för användare, menyer, kampanjer och beställningar
const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "database.db"), { verbose: console.log });

// Skapar tabeller om de inte redan finns
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    desc TEXT NOT NULL,
    price INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
  );
  
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    name TEXT NOT NULL,                   
    productId INTEGER NOT NULL,           
    discountType TEXT NOT NULL,            
    discountValue INTEGER NOT NULL,        
    isActive INTEGER DEFAULT 1             
  );
  
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    product TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES menu(id) ON DELETE CASCADE
  );
`);

// Exporterar databasen för att använda den i andra filer
module.exports = db; 