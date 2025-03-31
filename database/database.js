// Import better-sqlite3 library to interact with SQlite database
// create a new database connection
const Database = require("better-sqlite3");
const path = require("path");

  const db = new Database(path.join(__dirname, "menu.db"), { verbose: console.log});
  
// Creates an SQL-TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    desc TEXT NOT NULL,
    price INTEGER NOT NULL
    );
    `);

    // Exports this file as a module
    module.exports = db;