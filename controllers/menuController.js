const MenuModel = require('../models/menuModel'); // IMPORT THE MODEL

// Controller function to get all menu items
const getAllMenuItems = (req, res) => {
    try {
        // Use the model's static method
        const menu = MenuModel.getAll();
        res.json(menu);
    } catch (error) {
        console.error("Error in getAllMenuItems:", error); // Add logging
        res.status(500).json({ error: "Fel vid hämtning av objekt på menyn." });
    }
};

// Controller function to get a single menu item by ID
const getMenuItemById = (req, res) => {
    try {
        // Use the model's static method
        const item = MenuModel.getById(req.params.id);

        item ? res.json(item) : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        console.error("Error in getMenuItemById:", error); // Add logging
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
        // Use the model's static method
        const result = MenuModel.create(title, desc, price);

        res.status(201).json({ id: result.lastInsertRowid, title, desc, price });
    } catch (error) {
        console.error("Error in createMenuItem:", error); // Add logging
        res.status(500).json({ error: "Fel vid skapandet av produkt." });
    }
};


// Controller function to update an existing menu item by ID
const updateMenuItem = (req, res) => {
    const { title, desc, price } = req.body;
    const { id } = req.params; // Get id from params

    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        // Use the model's static method
        const result = MenuModel.update(id, title, desc, price);

        result.changes ? res.json({ id: id, title, desc, price })
                       : res.status(404).json({ error: "Produkten hittades inte eller inga ändringar gjordes" }); // Adjusted message
    } catch (error) {
        console.error("Error in updateMenuItem:", error); // Add logging
        res.status(500).json({ error: "Fel vid uppdatering av produkt." });
    }
};

// Controller function to delete a menu item by ID (soft delete)
const deleteMenuItem = (req, res) => {
    try {
        // Use the model's static method
        const result = MenuModel.delete(req.params.id);

        result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har markerats som borttagen.` })
                       : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        console.error("Error in deleteMenuItem:", error); // Add logging
        res.status(500).json({ error: "Fel vid borttagning av produkt." });
    }
};

// Controller function to restore a deleted menu item by ID
const restoreMenuItem = (req, res) => {
    try {
        // Use the model's static method
        const result = MenuModel.restore(req.params.id);

        result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har återställts.` })
                       : res.status(404).json({ error: "Produkten hittades inte eller var inte borttagen" }); // Adjusted message
    } catch (error) {
        console.error("Error in restoreMenuItem:", error); // Add logging
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
