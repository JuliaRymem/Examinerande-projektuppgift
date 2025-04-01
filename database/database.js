const Database = require("better-sqlite3");
const path = require("path");

// Create a new database-connection to menu.db
const db = new Database(path.join(__dirname, "menu.db"), { verbose: console.log });

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

module.exports = db;

