// Importerar nödvändiga moduler och databasen 
const db = require("../database/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Skapar en ny användare 
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }
  // Kontrollerar e-postformat 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Ogiltig e-postadress." });
  }
  if (password.length < 10) {
    return res.status(400).json({ error: "Lösenordet måste vara minst 10 tecken långt." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(userId, name, email, hashedPassword);
    res.status(201).json({ message: "Användare skapad!", userId });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ error: "Kunde inte skapa användare." });
  }
};

// Hämtar alla användare 
const getAllUsers = (req, res) => {
  try {
    const users = db.prepare("SELECT id, name, email, created_at FROM users").all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta användare." });
  }
};

// Hämtar en användare via ID 
const getUserById = (req, res) => {
  const userId = req.params.id;
  try {
    const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(userId);
    if (!user) return res.status(404).json({ error: "Användare hittades inte." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta användaren." });
  }
};

// Uppdaterar en användare 
const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }
  try {
    const stmt = db.prepare(`
      UPDATE users
      SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(name, email, userId);
    res.json({ message: "Användare uppdaterad!" });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte uppdatera användaren." });
  }
};

// Tar bort en användare 
const deleteUser = (req, res) => {
  const userId = req.params.id;
  try {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(userId);
    res.json({ message: "Användare borttagen!" });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte ta bort användaren." });
  }
};

// Exporterar funktionerna för användning i routes 
module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };