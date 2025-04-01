const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  deleteUser,
} = require("../controllers/userController");

// POST /register
router.post("/register", registerUser);

// POST /login
router.post("/login", loginUser);

// DELETE /delete/:id
router.delete("/delete/:id", deleteUser);

module.exports = router;


//register - skapa nytt konto - registerUser
//login - Logga in - loginUser
//delete - Ta bort användare + ordrar - deleteUser