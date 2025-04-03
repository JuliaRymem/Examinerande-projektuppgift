// Hanterar databaslogik för kampanjer
const db = require("../database/database");

// Funktioner för att hämta kampanjer från databasen
// Hämtar alla kampanjer där "isActive" är 1 (aktiva kampanjer)
const getActiveCampaign = () => {
  return db.prepare("SELECT * FROM campaigns WHERE isActive = 1").all(); 

};

// Hämtar kampanj för en specifik produkt
// Letar efter en kampanj där produkt-ID matchar och kampanjen är aktiv
const getCampaignByProduct = (productId) => {
  return db.prepare("SELECT * FROM campaigns WHERE productId = ? AND isActive = 1").get(productId);
};

module.exports = { getActiveCampaign, getCampaignByProduct };
