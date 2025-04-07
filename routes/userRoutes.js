// Importerar express och skapar en router för användarrelaterade rutter 
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUser, validateUserId } = require("../middleware/validateUser");

// Skapar en ny användare, validerar användardata
router.post("/", validateUser, userController.createUser);

// Hämtar alla användare
router.get("/", userController.getAllUsers);

// Hämtar en användare via ID, validerar ID
router.get("/:id", validateUserId, userController.getUserById);

// Uppdaterar en användare, validerar både ID och användardata
router.put("/:id", validateUserId, validateUser, userController.updateUser);

// Tar bort en användare, validerar användar-ID
router.delete("/:id", validateUserId, userController.deleteUser);

// Exporterar routern för användarrelaterade rutter 
module.exports = router;

