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