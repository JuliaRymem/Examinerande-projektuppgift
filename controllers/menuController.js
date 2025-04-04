/* Den här filen är till för menyhanteringen, HTTP-förfrågningar, 
anrop till databasen via menuModel, och skicka tillbaka svar till 
klienten, Importerar MenuModel... */
const MenuModel = require('../models/menuModel');

/* Hämtar alla menyalternativ */
const getAllMenuItems = (req, res) => {
    try {
        /* Hämtar alla menyobjekt från databasen 
        och returnerar en lista med alla produkter */
        const menu = MenuModel.getAll();
        /* Skickar menyobjekten som JSON-svar till klienten */
        res.json(menu);
    } catch (error) {
        /* Vid fel = felmeddelande, HTTP-statuskod 500 (serverfel) */
        console.error("Error in getAllMenuItems:", error);
        res.status(500).json({ error: "Fel vid hämtning av objekt på menyn." });
    }
};

/* Hämtar ett specifikt menyalternativ från databasen baserat på ID */
const getMenuItemById = (req, res) => {
    try {
        /* Hämtar ID från URL:en, exempelvis om användaren gör en 
        GET-förfrågan till /menu/5, så är req.params.id = 5 */
        const item = MenuModel.getById(req.params.id);
        /* Om produkten hittas skickas den som JSON och om produkten 
        inte finns i databasen ges HTTP-status-koden: "404 Not Found" */
        item ? res.json(item) : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        console.error("Error in getMenuItemById:", error);
        res.status(500).json({ error: "Fel vid hämtning av produkten." });
    }
};

/* Skapar ett nytt menyalternativ */
const createMenuItem = (req, res) => {
    /* Hämtar data från klienten, innehåller JSON-data som klienten skickar */
    const { title, desc, price } = req.body;
    /* Om något saknas skickas statuskoden 400 (Bad Request) och ett felmeddelande */
    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        /* Lägger till den nya produkten i databasen */
        const result = MenuModel.create(title, desc, price);
        /* Statuskoden 201 betyder "Created" (ny resurs skapad) */
        res.status(201).json({ id: result.lastInsertRowid, title, desc, price });
    } catch (error) {
        console.error("Error in createMenuItem:", error);
        res.status(500).json({ error: "Fel vid skapandet av produkt." });
    }
};

/* Koblock för att uppdatera en befintlig produkt */
const updateMenuItem = (req, res) => {
    const { title, desc, price } = req.body;
    const { id } = req.params;
    
    if (!title || !desc || !price) {
        return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
    }

    try {
        /* Uppdaterar produkten i databasen */
        /* Om inga ändringar har gjorts så returneras en "404 Not Found" (statuskod) */
        const result = MenuModel.update(id, title, desc, price);

        result.changes ? res.json({ id: id, title, desc, price })
                       : res.status(404).json({ error: "Produkten hittades inte eller inga ändringar gjordes" }); // Adjusted message
    } catch (error) {
        console.error("Error in updateMenuItem:", error);
        res.status(500).json({ error: "Fel vid uppdatering av produkt." });
    }
};

/* Kodblock för att bort ett menyalternativ med "soft delete" ("mjuk borttagning") */
/* Produkten tas inte bort helt från databasen, utan bara markeras som raderad */
const deleteMenuItem = (req, res) => {
    try {
        
        const result = MenuModel.delete(req.params.id);
        /* För att se om någon rad har ändrats */
        /* Om ingen rad har ändrats ges statuskoden "404 Not Found" */
        result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har markerats som borttagen.` })
                       : res.status(404).json({ error: "Produkten hittades inte" });
    } catch (error) {
        console.error("Error in deleteMenuItem:", error);
        res.status(500).json({ error: "Fel vid borttagning av produkt." });
    }
};

/* Kodblock för att återställa en borttagen produkt */
/* (Återställer en tidigare soft-deletad produkt) */
const restoreMenuItem = (req, res) => {
    try {
        const result = MenuModel.restore(req.params.id);

        result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har återställts.` })
                       : res.status(404).json({ error: "Produkten hittades inte eller var inte borttagen" }); // Adjusted message
    } catch (error) {
        console.error("Error in restoreMenuItem:", error);
        res.status(500).json({ error: "Fel vid återställning av produkt." });
    }
};

/* Exporterar alla funktioner så att de kan användas i andra filer */
module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,  
    deleteMenuItem,
    restoreMenuItem,
};
