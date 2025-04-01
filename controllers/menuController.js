// Import the database connection
const db = require("../database/database");  // Se till att detta pekar på rätt databasfil

// Controller function to get all menu items
const getAllMenuItems = (req, res) => {
    try {
        const menu = db.prepare("SELECT * FROM menu WHERE is_deleted = FALSE").all(); // Filtrera bort borttagna objekt
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: "Fel vid hämtning av objekt på menyn." });
    }
};

// Controller function to get a single menu item by ID
const getMenuItemById = (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM menu WHERE id = ? AND is_deleted = FALSE");
        const item = stmt.get(req.params.id);
        
        item ? res.json(item) : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        res.status(500).json({ error: "Fel vid hämtning av produkten." });
    }
};

// Controller function to create a new menu item
const createMenuItem = (req, res) => {
    const { title, desc, price } = req.body;  

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
        const result = stmt.run(title, desc, price);
        
        res.status(201).json({ id: result.lastInsertRowid, title, desc, price });
    } catch (error) {
        res.status(500).json({ error: "Fel vid skapandet av produkt." });
    }
};

// Controller function to update an existing menu item by ID
const updateMenuItem = (req, res) => {
    const { title, desc, price } = req.body;  

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ? AND is_deleted = FALSE");
        const result = stmt.run(title, desc, price, req.params.id);

        result.changes ? res.json({ id: req.params.id, title, desc, price }) 
                       : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        res.status(500).json({ error: "Fel vid uppdatering av produkt." });
    }
}; 

// Controller function to delete a menu item by ID
const deleteMenuItem = (req, res) => {
    try {
        const stmt = db.prepare("UPDATE menu SET is_deleted = TRUE WHERE id = ?");
        const result = stmt.run(req.params.id);

        result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har markerats som borttagen.` })
                       : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        res.status(500).json({ error: "Fel vid borttagning av produkt." });
    }
};

// Controller function to restore a deleted menu item by ID
const restoreMenuItem = (req, res) => {
    try {
        const stmt = db.prepare("UPDATE menu SET is_deleted = FALSE WHERE id = ?");
        const result = stmt.run(req.params.id);

        result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har återställts.` })
                       : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        res.status(500).json({ error: "Fel vid återställning av produkt." });
    }
};

// Export all controller functions
module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,  
    deleteMenuItem,
    restoreMenuItem,
};
