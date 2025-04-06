const db = require("../database/database");

// Hämtar alla kampanjer
const getAllCampaign = (req, res) => {
    try {
        const campaign = db.prepare("SELECT * FROM campaigns WHERE isActive = 1").all();
        res.json(campaign
        );
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta kampanjer." });
    }
};

// Hämtar en kampanj med ID
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

// Skapar en ny kampanj
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

// Uppdaterar en kampanj
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

// Mjuk borttagning (isActive = 0 istället för DELETE)
const softDeleteCampaign = (req, res) => {
    const campaignId = parseInt(req.params.id, 10); 
    try {
        const stmt = db.prepare("UPDATE campaigns SET isActive = 0 WHERE id = ?");
        stmt.run(campaignId);

        res.json({ message: "Kampanj inaktiverad (borttagen)!" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte ta bort kampanj." });
    }
};

// Återställer en inaktiverad kampanj
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
    getAllCampaign,
    getCampaignById,
    addCampaign,
    updateCampaign,
    softDeleteCampaign,
    restoreCampaign
};

