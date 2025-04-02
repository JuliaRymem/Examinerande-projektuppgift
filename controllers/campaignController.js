// Hanterar kampanjlogik

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

module.exports = { getCampaigns, applyCampaign };
