const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 🟢 Skapa en ny användare
router.post("/", userController.createUser);

// 🟢 Hämta alla användare
router.get("/", userController.getAllUsers);

// 🟢 Hämta en användare via ID
router.get("/:id", userController.getUserById);

// 🟢 Uppdatera en användare
router.put("/:id", userController.updateUser);

// 🟢 Ta bort en användare
router.delete("/:id", userController.deleteUser);

module.exports = router;

/* const express = require("express");
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
router.delete("/delete/:id", deleteUser); */


/* grabs all users
router.get('/users', async (req, res) => {
  try {
    const users = await userController.findAll();
    res.json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// grabs a specific user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await userController.findOne(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Användare hittades inte.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await userController.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// updates a user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await userController.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'Användare hittades inte.'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// deletes a user
router.delete('/users/:id', async (req, res) => {
  try {
    const result = await userController.remove(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Användare hittades inte.'});
    }
    res.json({ message: 'Användare har raderats,'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

module.exports = router;

//register - skapa nytt konto - registerUser
//login - Logga in - loginUser
//delete - Ta bort användare + ordrar - deleteUser
