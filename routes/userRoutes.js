const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  removeUser,
} = require("../controllers/userController");

// POST /register
router.post("/register", registerUser);

// POST /login
router.post("/login", loginUser);

// DELETE /delete
router.delete("/delete", removeUser);

module.exports = router;


//register - skapa nytt konto - registerUser
//login - Logga in - loginUser
//delete - Ta bort användare + ordrar - removeUser