const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// Fetch all menu items
router.get("/", menuController.getAllMenuItems);

// Fetch a specific menu item by I
router.get("/:id", menuController.getMenuItemById );

// Create a new menu item
router.post("/", menuController.createMenuItem);

// Update an existing menu item
router.put("/:id", menuController.updateMenuItem);

// Delete a menu item
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;