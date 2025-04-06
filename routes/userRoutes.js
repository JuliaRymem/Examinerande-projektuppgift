// Importerar express och skapar en router för användarrelaterade rutter 
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const { validateUser, validateUserId } = require("../middleware/validateUser");

// Skapar en ny användare
router.post("/", userController.createUser);

// Hämtar alla användare
router.get("/", userController.getAllUsers);

// Hämtar en användare via ID
router.get("/:id", userController.getUserById);

// Uppdaterar en användare
router.put("/:id", userController.updateUser);

// Tar bort en användare
router.delete("/:id", userController.deleteUser);

module.exports = router; 
