const db = require("../database/database");

// 🟢 Hämta alla kampanjer
const getAllCampaign = (req, res) => {
    try {
        const campaign = db.prepare("SELECT * FROM campaigns WHERE isActive = 1").all();
        res.json(campaign
        );
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta kampanjer." });
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

// 🟢 Mjuk borttagning (isActive = 0 istället för DELETE)
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

// 🟢 Återställ en inaktiverad kampanj
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

/* const db = require("../database/database");

// Hämta alla aktiva kampanjer
const getActiveCampaigns = (req, res) => {
    try {
        const campaigns = db.prepare("SELECT * FROM campaigns WHERE isActive = 1").all();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: "Kunde inte hämta kampanjer." });
    }
};

// Hämta en specifik kampanj med ID
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

// Skapa en ny kampanj
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

// Uppdatera en kampanj
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

// Ta bort en kampanj
const deleteCampaign = (req, res) => {
    const campaignId = parseInt(req.params.id, 10);
    try {
        const stmt = db.prepare("DELETE FROM campaigns WHERE id = ?");
        stmt.run(campaignId);

        res.json({ message: "Kampanj borttagen!" });
    } catch (error) {
        res.status(500).json({ error: "Kunde inte ta bort kampanj." });
    }
};

module.exports = {
    getActiveCampaigns,
    getCampaignById,
    addCampaign,
    updateCampaign,
    deleteCampaign
};

/* Hanterar kampanjlogik
const campaignModel = require("../models/campaignModel");

// Funktion för att hämta aktiva kampanjer
const getCampaigns = (req, res) => {
  try {
    const campaigns = campaignModel.getActiveCampaigns(); // Hämtar alla aktiva kampanjer från databasen

    if (campaigns.length === 0) {
      return res.json({ message: "Inga aktiva kampanjer." }); // Om det inte finns några kampanjer, skicka ett meddelande
    }
    
    // Skicka kampanjerna som svar
     // Om något går fel, skicka ett felmeddelande
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta kampanjer", details: error.message }); 
  
  }
};

// Funktion för att applicera kampanjer på varukorgen
const applyCampaign = (cart) => {
  let discount = 0; // Startar utan rabatt
  let discountMessage = ""; // 

  cart.forEach((item) => {
    const campaign = campaignModel.getCampaignByProduct(item.id); // Kollar om det finns en kampanj för produkten

    if (campaign && campaign.discountType === "buy2get1" && item.quantity >= 2) {
      // Om kampanjtypen är "köp 2, få 1 gratis" och användaren köper minst 2 av produkten
      const freeItems = Math.floor(item.quantity / 2); // B
      discount += freeItems * item.price; // Räknar ut den totala rabatten
      discountMessage = `Kampanj: Köp 2, få 1 gratis på ${item.name}`; // Meddelande om rabatten
    }
  });

  return { discount, discountMessage }; // Returnerar rabatten och meddelandet
};

module.exports = { getCampaigns, applyCampaign }; */
