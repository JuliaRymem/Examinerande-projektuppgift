const express = require("express");
const cors = require("cors");
const db = require("./database");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRoutes); // Användar-relaterade routes
app.use("/order", orderRoutes); // Order-relaterade routes

// Fetching the menu
app.get("/menu", (req, res) => {
    const menu = db.prepare("SELECT * FROM menu").all(); // Using a prepared statement
    res.json(menu);
});

// Fetch data about a specific product
app.get("/menu/:id", (req, res) => {
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Produkt hittades inte"});
    }
});

// Add a new product
app.post("/menu", (req, res) => {
    const {title, desc, price } = req.body;
    const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
    const result = stmt.run(title, desc, price);
    res.json({ id: result.lastInsertRowid, title, desc, price });
});

// Update a product
app.put("/menu/:id", (req, res) => {
    const { title, desc, price } = req.body;
    const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
    const result = stmt.run(title, desc, price, req.params.id);
    if (result.changes) {
       res.json({ id: req.params.id, title, desc, price });
    }  else {
       res.status(404).json({ error: "Produkt hittades inte"});
    }
    });

// Delete a product
app.delete("/menu/:id", (req, res) => {
    const stmt = db.prepare("DELETE FROM menu WHERE id = ?");
    const result = stmt.run(req.params.id);
    if (result.changes) {
        res.json({ message: "Produkten har tagits bort"}); // change to msg?
    } else {
        res.status(404).json({ error: "Produkt hittades inte" });
    }
});

// Running on port...
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` 🟢 Servern körs på http//localhost:${PORT}`);
});
=======
/* This code uses prepared statements to prevent SQL-injections... */

const express = require("express");
const cors = require("cors");
const db = require("./database/database");  
const menuRoutes = require("./routes/menuRoutes");

const app = express();
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) to allow API access from different domains
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use("/menu", menuRoutes);

// Helper function to fetch a product by its ID from the database
const getProductById = (id) => db.prepare("SELECT * FROM menu WHERE id = ?").get(id);

// Retrieve all menu items
app.get("/menu", (req, res) => {
    try {
        const menu = db.prepare("SELECT * FROM menu").all();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: "Internt serverfel"});
    }
});

// Retrieve a specific product by ID
app.get("/menu/:id", (req, res) => {
    const item = getProductById(req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Produkten hittades inte" });
    }
});
    
// Add a new product to the menu
app.post("/menu", (req, res) => {
    const { title, desc, price } = req.body;

    // // Validate that all required fields are provided
    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
        const result = stmt.run(title, desc, price);
        res.status(201).json({ id: result.lastInsertRowid, title, desc, price });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte skapa produkten" });
    }
});
    
// Update an existing product by ID
app.put("/menu/:id", (req, res) => {
    const { title, desc, price } = req.body;
    const { id } = req.params;

    // // Validate input data
    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
        const result = stmt.run(title, desc, price, id);

        if (result.changes) {
            res.json({ id, title, desc, price });
        } else {
            res.status(404).json({ error: "Produkten hittades inte" });
        }
    } catch (error) {
        res.status(500).json({ error: "Kunde inte uppdatera produkten" });
    }
});

// Delete a product by ID
app.delete("/menu/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM menu WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes) {
        res.json({ message: `Produkt med ID ${id} har tagits bort` });
    } else {
        res.status(404).json({ error: "Produkten hittades inte" });
    }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` 🟢 Servern körs på http//localhost:${PORT}`);
});

/* This code uses prepared statements to prevent SQL-injections... */
