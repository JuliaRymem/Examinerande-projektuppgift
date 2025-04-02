const bcrypt = require("bcrypt");
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

module.exports = { registerUser, loginUser, deleteUser };
