const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "database.db"), { verbose: console.log });

// 🔍 Funktion för att kolla om en kolumn existerar
function columnExists(table, column) {
  const result = db.prepare(`PRAGMA table_info(${table})`).all();
  return result.some(row => row.name === column);
}

// 🏗️ Skapa tabeller om de inte finns
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

  CREATE TABLE IF NOT EXISTS campaign (
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
    amount INTEGER NOT NULL,
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

console.log("✅ Tabeller skapade (om de inte redan fanns)!");

// 🛠️ Lägg endast till kolumner om de inte redan finns
try {
  if (!columnExists("orders", "discount")) {
    db.exec("ALTER TABLE orders ADD COLUMN discount REAL DEFAULT 0;");
  }

  if (!columnExists("orders", "finalTotal")) {
    db.exec("ALTER TABLE orders ADD COLUMN finalTotal REAL;");
  }

  if (!columnExists("order_items", "price_at_order")) {
    db.exec("ALTER TABLE order_items ADD COLUMN price_at_order REAL;");
  }

  console.log("✅ Kolumner uppdaterade (om det behövdes)!");
} catch (error) {
  console.error("❌ Fel vid schemaändring:", error);
}

// 🎯 Lägg till en testkampanj om inga kampanjer finns
const campaignExists = db.prepare("SELECT COUNT(*) AS count FROM campaign").get();
if (campaignExists.count === 0) {
  db.prepare(`
    INSERT INTO campaign (name, productId, discountType, discountValue, isActive)
    VALUES ('Köp 2 bryggkaffe, få en gratis', 1, 'buy2get1', 100, 1)
  `).run();
  console.log("✅ Testkampanj tillagd!");
}

module.exports = db;


/* const Database = require("better-sqlite3");
const path = require("path");
// NEW CODE ?
const db = new Database(path.join(__dirname, "database.db"), { verbose: console.log });

// OLD CODE
/* const db = new Database(path.join(__dirname, "menu.db"), { verbose: console.log }); */

/* ALTER TABLE - Lägg till kolumner om de inte redan finns NEW CODE 
try {
  db.exec("ALTER TABLE orders ADD COLUMN discount REAL DEFAULT 0;");
  db.exec("ALTER TABLE orders ADD COLUMN finalTotal REAL;");
  db.exec("ALTER TABLE order_items ADD COLUMN price_at_order REAL;");
  console.log("Tabeller uppdaterade!");
} catch (error) {
  console.error("Fel vid schemaändring:", error);
}

db.close();

// NEW CODE
db.exec(` 
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_order REAL NOT NULL, 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES menu(id) ON DELETE CASCADE
`);

 // Create menu-table if it doesn't already exists
db.exec(`
  CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    desc TEXT NOT NULL,
    price INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
  );
`);

// Create campaign-table if doesn't already exists
db.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    name TEXT NOT NULL,                   
    productId INTEGER NOT NULL,           
    discountType TEXT NOT NULL,            
    discountValue INTEGER NOT NULL,        
    isActive INTEGER DEFAULT 1             
  );
`);

// Add to test campaign-functionality if non exists
const campaignExists = db.prepare("SELECT COUNT(*) AS count FROM campaigns").get();
if (campaignExists.count === 0) {
  // If no campaign exists then add a campaign
  db.prepare(`
    INSERT INTO campaigns (name, productId, discountType, discountValue, isActive)
    VALUES ('Köp 2 bryggkaffe, få en gratis', 1, 'buy2get1', 100, 1)
  `).run();
}

// ADDED CODE
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `);

  // ADDED CODE
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product TEXT NOT NULL,
    amount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
    `);

module.exports = db; */

