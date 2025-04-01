// Import the MenuModel to interact with the menu data in the database
const MenuModel = require("../models/menuModel");

// Controller function to get all menu items
const getAllMenuItems = (req, res) => {
    try {
        const menu = MenuModel.getAll();  // Retrieves all menu items
        res.json(menu);  // Sends the menu items as a JSON response
    } catch (error) {
        res.status(500).json({ error: "Error fetching menu items" }); // Handles database errors
    }
};

// Controller function to get a single menu item by ID
const getMenuItemById = (req, res) => {
    try {
        const item = MenuModel.getById(req.params.id);  // Fetch the menu item by its ID
        item ? res.json(item) : res.status(404).json({ error: "Product not found" });  // If item exists, return it, else return 404
    } catch (error) {
        res.status(500).json({ error: "Error fetching the menu item" });  // Handle database errors
    }
};

// Controller function to create a new menu item
const createMenuItem = (req, res) => {
    const { title, desc, price } = req.body;  // Extracts the title, description, and price from the request body

    // Validate input data
    if (!title || !desc || !price) {
        return res.status(400).json({ error: "All fields (title, desc, price) must be provided" });
    }

    try {
        const result = MenuModel.create(title, desc, price);  // Creates a new menu item in the database
        res.status(201).json({ id: result.lastInsertRowId, title, desc, price });  // Returns the newly created menu item with its ID
    } catch (error) {
        res.status(500).json({ error: "Error creating menu item" });  // Handles any database errors
    }
};

// Controller function to update an existing menu item by ID
const updateMenuItem = (req, res) => {
    const { title, desc, price } = req.body;  // Extracts the updated details from the request body

    // Validate input data
    if (!title || !desc || !price) {
        return res.status(400).json({ error: "All fields (title, desc, price) must be provided" });
    }

    try {
        const result = MenuModel.update(req.params.id, title, desc, price);  // Updates the menu item in the database
        result.changes ? res.json({ id: req.params.id, title, desc, price }) : res.status(404).json({ error: "Product not found" });  // Return the updated item or 404 if not found
    } catch (error) {
        res.status(500).json({ error: "Error updating menu item" });  // Handles any database errors
    }
};

// Controller function to delete a menu item by ID
const deleteMenuItem = (req, res) => {
    try {
        const result = MenuModel.delete(req.params.id);  // Deletes the menu item from the database
        result.changes ? res.json({ message: "Product has been deleted" }) : res.status(404).json({ error: "Product not found" });  // Return success message or 404 if not found
    } catch (error) {
        res.status(500).json({ error: "Error deleting menu item" });  // Handles any database errors
    }
};

// Export all controller functions for use in routing
module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
};