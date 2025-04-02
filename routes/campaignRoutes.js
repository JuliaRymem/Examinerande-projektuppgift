// Skapar en API- för att hämta alla aktiva kampanjer

const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController"); // Importerar kampanjkontrollern
const db = require("../database/database");  //provar...

// Hämta alla aktiva kampanjer
router.get("/", campaignController.getCampaigns);

module.exports = router;
