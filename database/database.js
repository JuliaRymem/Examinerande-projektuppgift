// Import better-sqlite3 library to interact with SQlite database
const Database = require("better-sqlite3");

// Import the path module to work with file and directory paths
const path = require("path");

// Create a new database connection to the 'menu.db' file, with verbose logging enabled
const db = new Database(path.join(__dirname, "menu.db"), { verbose: console.log});
  
// Create the 'menu' SQL-table if it doesn't already exist
db.exec(`
    CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    desc TEXT NOT NULL,
    price INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
    );
    `);

// Export the database connection so it can be used in other files
module.exports = db;