// Importerar data från en JSON-fil till en SQLite-databas med hjälp av better-sqlite3 
const fs = require("fs"); 
const db = require("./database"); 

// Skapar en tabell för menyn om den inte redan finns... 
try {
  const rawData = fs.readFileSync("./menu.json"); 
  const menuData = JSON.parse(rawData).menu; 

// Skapar en ny post för varje objekt i menyn 
const insert = db.prepare(` 
    INSERT INTO menu (id, title, desc, price)
    VALUES (@id, @title, @desc, @price)
  `);

// Skapar tabellen om den inte redan finns...
db.transaction(() => { // 
  menuData.forEach((item) => {
      if (item.title && item.desc && item.price) {
          insert.run(item);
      } else {
          console.error(`Felaktig data för objekt med ID ${item.id}: Saknar obligatoriska fält`);
      }
  });
})(); 
  
  // Meddelande om att datan har importerats  
   console.log(" 📥 Data har importerats till databasen.");
  // Felmeddelande om att datan inte har importerats 
  } catch (error) {
      console.error("Fel vid import:", error);
  }