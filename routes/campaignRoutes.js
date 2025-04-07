// Importerar express och router samt kampanjkontrollern
const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");

// Definierar rutter för kampanjhantering
router.get("/", campaignController.getAllCampaign);
router.get("/:id", campaignController.getCampaignById);
router.post("/", campaignController.addCampaign);
router.put("/:id", campaignController.updateCampaign);
router.delete("/:id", campaignController.softDeleteCampaign);
router.patch("/:id/restore", campaignController.restoreCampaign);

// Exporterar router så att den kan användas för att hantera kampanjer
module.exports = router;



