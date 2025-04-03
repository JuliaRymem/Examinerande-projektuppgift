/* const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const db = require("../database/database"); */

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Define the path to menu.json
const menuPath = path.join(__dirname, "../database/menu.json"); // Adjust if needed

// GET /menu - Serve menu.json contents
router.get("/", (req, res) => {
    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load menu." });
        }
        res.json(JSON.parse(data));
    });
});

// GET specific menu item by ID
router.get("/:id", (req, res) => {
    const itemId = parseInt(req.params.id, 10); // Convert ID to a number

    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load menu." });
        }

        const menuData = JSON.parse(data);
        const item = menuData.menu.find((menuItem) => menuItem.id === itemId); // Access the "menu" array

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(item);
    });
});

router.put("/:id", (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const { title, desc, price } = req.body; // Data to update

    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load menu." });
        }

        let menuData = JSON.parse(data);

        // Find the item index
        const itemIndex = menuData.menu.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found" });
        }

        // Update the item
        if (title) menuData.menu[itemIndex].title = title;
        if (desc) menuData.menu[itemIndex].desc = desc;
        if (price) menuData.menu[itemIndex].price = price;

        // Save updated data
        fs.writeFile(menuPath, JSON.stringify(menuData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update menu." });
            }
            res.json({ message: "Menu item updated successfully", item: menuData.menu[itemIndex] });
        });
    });
});

module.exports = router;

/* Fetch all menu items
router.get("/", menuController.getAllMenuItems);

/* Fetch a specific menu item by I
router.get("/:id", menuController.getMenuItemById );

// Create a new menu item
router.post("/", menuController.createMenuItem);

// Update an existing menu item
router.put("/:id", menuController.updateMenuItem);

// Delete a menu item
router.delete("/:id", menuController.deleteMenuItem);

// Restore a product
router.put("/restore/:id", menuController.restoreMenuItem);

module.exports = router; */