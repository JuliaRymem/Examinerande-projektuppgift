const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");

// 🟢 Hämta alla kampanjer
router.get("/", campaignController.getAllCampaign);

// 🟢 Hämta en kampanj via ID
router.get("/:id", campaignController.getCampaignById);

// 🟢 Skapa en ny kampanj
router.post("/", campaignController.addCampaign);

// 🟢 Uppdatera en kampanj
router.put("/:id", campaignController.updateCampaign);

// 🟢 Ta bort en kampanj (mjuk borttagning)
router.delete("/:id", campaignController.softDeleteCampaign);

// 🟢 Återställ en kampanj
router.patch("/:id/restore", campaignController.restoreCampaign);

module.exports = router;

/*const db = require("../database/database");

// 🟢 Hämta alla aktiva kampanjer
const getActiveCampaigns = (req, res) => {
    try {
        const campaigns = db.prepare("SELECT * FROM campaigns WHERE isActive = 1").all();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta aktiva kampanjer." });
    }
};

// 🟢 Hämta en kampanj med ID
const getCampaignById = (req, res) => {
    const campaignId = parseInt(req.params.id, 10);
    try {
        const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(campaignId);
        if (!campaign) return res.status(404).json({ error: "Kampanj hittades inte." });

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta kampanjen." });
    }
};

// 🟢 Skapa en ny kampanj
const addCampaign = (req, res) => {
    const { title, discount, productId, startDate, endDate } = req.body;

    if (!title || !discount || !productId || !startDate || !endDate) {
        return res.status(400).json({ error: "Alla fält måste fyllas i." });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO campaigns (title, discount, productId, startDate, endDate, isActive)
            VALUES (?, ?, ?, ?, ?, 1)
        `);
        stmt.run(title, discount, productId, startDate, endDate);

        res.status(201).json({ message: "Kampanj skapad!" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte skapa kampanj." });
    }
};

// 🟢 Uppdatera en kampanj
const updateCampaign = (req, res) => {
    const campaignId = parseInt(req.params.id, 10);
    const { title, discount, productId, startDate, endDate, isActive } = req.body;

    if (!title || !discount || !productId || !startDate || !endDate || isActive === undefined) {
        return res.status(400).json({ error: "Alla fält måste fyllas i." });
    }

    try {
        const stmt = db.prepare(`
            UPDATE campaigns
            SET title = ?, discount = ?, productId = ?, startDate = ?, endDate = ?, isActive = ?
            WHERE id = ?
        `);
        stmt.run(title, discount, productId, startDate, endDate, isActive, campaignId);

        res.json({ message: "Kampanj uppdaterad!" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte uppdatera kampanj." });
    }
};

// 🟢 Ta bort en kampanj (logisk borttagning)
const deleteCampaign = (req, res) => {
    const campaignId = parseInt(req.params.id, 10);
    try {
        const stmt = db.prepare("UPDATE campaigns SET isActive = 0 WHERE id = ?");
        stmt.run(campaignId);

        res.json({ message: "Kampanj inaktiverad (borttagen)!" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte ta bort kampanj." });
    }
};

// 🟢 Återställ en borttagen kampanj
const restoreCampaign = (req, res) => {
    const campaignId = parseInt(req.params.id, 10);
    try {
        const stmt = db.prepare("UPDATE campaigns SET isActive = 1 WHERE id = ?");
        stmt.run(campaignId);

        res.json({ message: "Kampanj återställd!" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte återställa kampanj." });
    }
};

module.exports = {
    getActiveCampaigns,
    getCampaignById,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    restoreCampaign
};


/* Skapar en API- för att hämta alla aktiva kampanjer

const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController"); // Importerar kampanjkontrollern
const db = require("../database/database");  //provar...

// Hämta alla aktiva kampanjer
router.get("/", campaignController.getCampaigns);

module.exports = router; */
