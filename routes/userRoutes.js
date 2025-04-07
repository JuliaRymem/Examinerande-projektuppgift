// Importerar express och skapar en router för användarrelaterade rutter 
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUser, validateUserId } = require("../middleware/validateUser");

// Skapar en ny användare
router.post("/", validateUser, userController.createUser);

// Hämtar alla användare
router.get("/", userController.getAllUsers);

// Hämtar en användare via ID
router.get("/:id", validateUserId, userController.getUserById);

// Uppdaterar en användare
router.put("/:id", validateUserId, validateUser, userController.updateUser);

// Tar bort en användare
router.delete("/:id", validateUserId, userController.deleteUser);

// Exporterar routern för användarrelaterade rutter 
module.exports = router;

