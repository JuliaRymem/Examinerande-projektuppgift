// Denna fil innehåller funktioner för att hämta kampanjer från databasen

// Importerar nödvändiga moduler och databasen 
const db = require("../database/database");

// Hämtar aktiva kampanjer från databasen 
const getActiveCampaign = () => { //
  return db.prepare("SELECT * FROM campaigns WHERE isActive = 1").all();
};

// Hämtar kampanj för en specifik produkt 
const getCampaignByProduct = (productId) => {
  return db.prepare("SELECT * FROM campaigns WHERE productId = ? AND isActive = 1").get(productId);
};

// Exporterar funktionerna så att de kan användas i andra delar av applikationen 
module.exports = { getActiveCampaign, getCampaignByProduct };



