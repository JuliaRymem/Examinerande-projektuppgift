const fs = require("fs"); // Import the built-in file system (fs) module to read files
const db = require("./database"); // Import the database module (using better-sqlite3)

try {
  const rawData = fs.readFileSync("./menu.json"); // Read the menu data from the JSON file as a raw string
  const menuData = JSON.parse(rawData).menu; // Parse the raw JSON string into a JavaScript object and extract the 'menu' array

// Prepare an SQL INSERT statement for inserting menu items (prepaed statements helps to prvent SQL-injections)
const insert = db.prepare(`
    INSERT INTO menu (id, title, desc, price)
    VALUES (@id, @title, @desc, @price)
  `);

// Start a database transaction
db.transaction(() => {
  menuData.forEach((item) => {
      // Validate that each item has the necessary properties
      if (item.title && item.desc && item.price) {
          // Execute the prepared statement for each menu item
          insert.run(item);
      } else {
          // Log an error if the item data is missing required fields
          console.error(`Felaktig data för objekt med ID ${item.id}: Saknar obligatoriska fält`);
      }
  });
})(); // End of the transaction

  // Log a confirmation message after the import is complete
   console.log(" 📥 Data har importerats till databasen.");
  
  // Catch and log any errors that occur during file reading, JSON parsing, or database operations
  } catch (error) {
      console.error("Fel vid import:", error);
  }