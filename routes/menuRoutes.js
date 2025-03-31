const express = require("express");
const router = express.router();
const menuController = require("../controllers/menuController");

router.get("/", menuController.getAllMenuItems);
router.get("/:id", menuController.getMenuItemById );
router.get("/", menuController.createMenuItem);
router.get("/:id", menuController.updateMenuItem);
router.get("/:id", menuController.deleteMenuItem);

module.exports = router;