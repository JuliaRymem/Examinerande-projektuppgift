//
const express = require("express");
const router = express.Router();
const db = require("/db");

//Get campaigns
//Middleware to check if token is valid
router.get('/', checkAdminToken, async (req, res) => {
    const campaigns = await campaignsDb.find({});
    if (campaigns.length > 0) {
      res.json({ success: true, campaigns });
    } else {
      res.status(404).send({ success: false, error: 'No campaigns found' });
    }
  });