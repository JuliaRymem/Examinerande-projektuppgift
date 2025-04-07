// routes/campaignRoutes.js
const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");

router.get("/", campaignController.getAllCampaign);
router.get("/:id", campaignController.getCampaignById);
router.post("/", campaignController.addCampaign);
router.put("/:id", campaignController.updateCampaign);
router.delete("/:id", campaignController.softDeleteCampaign);
router.patch("/:id/restore", campaignController.restoreCampaign);

module.exports = router;



