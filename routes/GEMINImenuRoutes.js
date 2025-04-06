const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { validateMenuItem, validateMenuItemId } = require("../middleware/validateMenu");
const menuPath = path.join(__dirname, "../database/menu.json");

router.get("/", (req, res) => { /* ... */ });
router.get("/:id", validateMenuItemId, (req, res) => { /* ... */ });
router.put("/:id", validateMenuItemId, validateMenuItem, (req, res) => { /* ... */ });
router.delete("/:id", validateMenuItemId, (req, res) => { /* ... */ });
router.patch("/:id/restore", validateMenuItemId, (req, res) => { /* ... */ });

module.exports = router;