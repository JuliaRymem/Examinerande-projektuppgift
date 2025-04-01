// Skapar kampanjtabell i databasen

const db = require("better-sqlite3");

// Ansluter till SQLite-databasen
const database = new db("/", { verbose: console.log }); //** Skriv in databasens namn här ?? **

// Skapar kampanjtabell
database.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    name TEXT NOT NULL,                   
    productId INTEGER NOT NULL,           
    discountType TEXT NOT NULL,            
    discountValue INTEGER NOT NULL,        
    isActive INTEGER DEFAULT 1             
  );
`);

// Kontrollerar om det redan finns kampanjer i databasen
const campaignExists = database.prepare("SELECT COUNT(*) AS count FROM campaigns").get();
if (campaignExists.count === 0) {
  // Om inga kampanjer finns, lägg till en testkampanj (?)
  database.prepare(`
    INSERT INTO campaigns (name, productId, discountType, discountValue, isActive)
    VALUES ('Köp 2 bryggkaffe, få en gratis', 1, 'buy2get1', 100, 1)
  `).run();
}

module.exports = database;
