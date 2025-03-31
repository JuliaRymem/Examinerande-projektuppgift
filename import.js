// import the built-in file system module
// import database
const fs = require("fs"); 
const db = require("./database"); 

// read the file as a raw text string
// parse the JSOn string into a JavaScript object
const rawData = fs.readFileSync("menu.json");
const menuData = JSON.parse(rawData).menu;  

// Prepare an SQL INSERT statement
const insert = db.prepare(`
    INSERT INTO menu (id, title, desc, price)
    VALUES (@id, @title, @desc, @price)
  `);

  // Insert each item from the JSON file into the database using a transaction
db.transaction(() => {
    menuData.forEach((item) => insert.run(item)); // Execute the INSERT statement for each item
  })();

  //// Log confirmation message
  console.log("Data har importerats till databasen.");
