// Importerar nödvändiga moduler
const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");

// Hämtar alla kampanjer
router.get("/", campaignController.getAllCampaign);

// Hämtar en kampanj via ID
router.get("/:id", campaignController.getCampaignById);

// Skapar en ny kampanj
router.post("/", campaignController.addCampaign);

// Uppdaterar en kampanj
router.put("/:id", campaignController.updateCampaign);

// Tar bort en kampanj (mjuk borttagning)
router.delete("/:id", campaignController.softDeleteCampaign);

// Återställer en kampanj
router.patch("/:id/restore", campaignController.restoreCampaign);

// Exporterar routern för att kunna användas i appen 
module.exports = router;

