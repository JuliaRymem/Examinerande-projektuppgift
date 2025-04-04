const db = require("../database/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Skapa en ny användare
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Alla fält måste fyllas i." });
    }

    // Kontrollera e-postformat
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Ogiltig e-postadress." });
    }

    // Kontrollera att lösenordet är minst 10 tecken långt
    if (password.length < 10) {
        return res.status(400).json({ error: "Lösenordet måste vara minst 10 tecken långt." });
    }

    try {
        // Hasha lösenordet
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4(); // Skapa UUID

        // Infoga i databasen
        const stmt = db.prepare(`
            INSERT INTO users (id, name, email, password)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(userId, name, email, hashedPassword);

        res.status(201).json({ message: "Användare skapad!", userId });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte skapa användare." });
    }
};

// Hämta alla användare
const getAllUsers = (req, res) => {
    try {
        const users = db.prepare("SELECT id, name, email, created_at FROM users").all();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta användare." });
    }
};

// Hämta en användare via ID
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

// Uppdatera en användare
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

// Ta bort en användare
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

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };

/*const bcrypt = require("bcrypt");
const { createUser, findUserByUsername, deleteUserById } = require("../models/userModel");
const db = require("../database/database");  //provar...

// Registrera ny användare
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(Date.now().toString(), username, hashedPassword);
        res.status(201).json({ message: "Användare skapad", user });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte skapa användare" });
    }
};

// Logga in användare
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
        }
        res.json({ message: "Inloggning lyckades", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte logga in" });
    }
};

// Ta bort användare
const deleteUser = async (req, res) => {
    try {
        await deleteUserById(req.params.id);
        res.json({ message: "Användare och dess ordrar har raderats" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte radera användare" });
    }
};

module.exports = { registerUser, loginUser, deleteUser }; */
