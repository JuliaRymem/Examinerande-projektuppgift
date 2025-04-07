// Denna fil innehåller alla funktioner för att hantera menyobjekt. 
const MenuModel = require('../models/menuModel');

const getAllMenuItems = (req, res) => {
  try {
    const menu = MenuModel.getAll();
    res.json(menu);
  } catch (error) {
    console.error("Error in getAllMenuItems:", error);
    res.status(500).json({ error: "Fel vid hämtning av menyn." });
  }
};

// Hämtar ett specifikt menyalternativ från databasen baserat på ID 
const getMenuItemById = (req, res) => {
  try {
    const item = MenuModel.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Produkten hittades inte." });
    }
    res.json(item);
  } catch (error) {
    console.error("Error in getMenuItemById:", error);
    res.status(500).json({ error: "Fel vid hämtning av produkten." });
  }
};

// Skapar ett nytt menyalternativ 
const createMenuItem = (req, res) => {
  const { title, desc, price } = req.body;
  try {
    const result = MenuModel.create(title, desc, price);
    res.status(201).json({ id: result.lastInsertRowid, title, desc, price });
  } catch (error) {
    console.error("Error in createMenuItem:", error);
    res.status(500).json({ error: "Fel vid skapande av produkt." });
  }
};

// Kodblock för att uppdatera en befintlig produkt
const updateMenuItem = (req, res) => {
  const { title, desc, price } = req.body;
  const { id } = req.params;
  try {
    const result = MenuModel.update(id, title, desc, price);
    if (result.changes) {
      res.json({ id, title, desc, price });
    } else {
      res.status(404).json({ error: "Produkten hittades inte eller inga ändringar gjordes." });
    }
  } catch (error) {
    console.error("Error in updateMenuItem:", error);
    res.status(500).json({ error: "Fel vid uppdatering av produkt." });
  }
};

// Kodblock för att bort ett menyalternativ med "soft delete" ("mjuk borttagning") 
const deleteMenuItem = (req, res) => {
  try {
    const result = MenuModel.delete(req.params.id);
    if (result.changes) {
      res.json({ message: `Produkt med ID ${req.params.id} har markerats som borttagen.` });
    } else {
      res.status(404).json({ error: "Produkten hittades inte." });
    }
  } catch (error) {
    console.error("Error in deleteMenuItem:", error);
    res.status(500).json({ error: "Fel vid borttagning av produkt." });
  }
};

// Kodblock för att återställa en borttagen produkt 
const restoreMenuItem = (req, res) => {
  try {
    const result = MenuModel.restore(req.params.id);
    if (result.changes) {
      res.json({ message: `Produkt med ID ${req.params.id} har återställts.` });
    } else {
      res.status(404).json({ error: "Produkten hittades inte eller var inte borttagen." });
    }
  } catch (error) {
    console.error("Error in restoreMenuItem:", error);
    res.status(500).json({ error: "Fel vid återställning av produkt." });
  }
};

// Exporterar alla funktioner så att de kan användas i andra filer 
module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  restoreMenuItem
};
