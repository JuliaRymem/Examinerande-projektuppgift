/* Den här filen hanterar CRUD-operationer 
(Create, Read, Update, Delete) på menyn, 
men sparar data i en JSON-fil istället för 
en databas. */

/* Importerar nödvändiga moduler... */
const express = require("express");
/* För att läsa och skriva filer */
const fs = require("fs");
/* För att hantera fil- och mappvägar */
const path = require("path");
/* Skapar en router för HTTP-rutter */
const router = express.Router();

/* Sökvägen till menu.json */
const menuPath = path.join(__dirname, "../database/menu.json");

/* Hämtar hela menyn */
/* Hanterar en GET-förfrågan till /menu */
router.get("/", (req, res) => {
    /* Läser in innehållet i menu.json som en textsträng */
    fs.readFile(menuPath, "utf8", (err, data) => {
        /* Om ett fel uppstår skickas status-koden 500 */
        if (err) {
            return res.status(500).json({ error: "Failed to load menu." });
        }
        res.json(JSON.parse(data));
    });
});

/* Hämtar ett specifikt menyobjekt med GET-metoden */
router.get("/:id", (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load menu." });
        }

        const menuData = JSON.parse(data);
        /* Läser menu.json och söker efter objektet med det ID:t */
        const item = menuData.menu.find((menuItem) => menuItem.id === itemId);
        /* Om inget hittas så  skickas statuskoden "404 Item not found" */
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(item);
    });
});

/* Uppdaterar ett menyobjekt med PUT-metoden */
router.put("/:id", (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const { title, desc, price } = req.body;

    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load menu." });
        }

        let menuData = JSON.parse(data);

        /* Hittar meny-objektets index */
        const itemIndex = menuData.menu.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found" });
        }

        /* Uppdaterar meny-objektet med pris, beskrivning och namn */
        if (title) menuData.menu[itemIndex].title = title;
        if (desc) menuData.menu[itemIndex].desc = desc;
        if (price) menuData.menu[itemIndex].price = price;

        /* Sparar uppdaterad data */
        fs.writeFile(menuPath, JSON.stringify(menuData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update menu." });
            }
            res.json({ message: "Menu item updated successfully", item: menuData.menu[itemIndex] });
        });
    });
});

/* "Mjuk borttagning" ("Soft delete") av en menyprodukt med DELETE-metoden */
/* Istället för att radera objektet helt, sätter man active = false.
och det kallas "soft delete", eftersom objektet fortfarande finns kvar men är inaktivt. */
router.delete("/:id", (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load menu." });

        let menuData = JSON.parse(data);
        const itemIndex = menuData.menu.findIndex(item => item.id === itemId);

        if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });

        menuData.menu[itemIndex].active = false; // Mark item as inactive (soft delete)

        fs.writeFile(menuPath, JSON.stringify(menuData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete menu item." });

            res.json({ message: "Menu item deleted successfully", item: menuData.menu[itemIndex] });
        });
    });
});

/* Återställer ett menyobjekt med PATCH-metoden */
router.patch("/:id/restore", (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    fs.readFile(menuPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load menu." });

        let menuData = JSON.parse(data);
        const itemIndex = menuData.menu.findIndex(item => item.id === itemId);

        if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });
        /* Sätter active = true för att återaktivera menyalternativet */
        menuData.menu[itemIndex].active = true;

        fs.writeFile(menuPath, JSON.stringify(menuData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to restore menu item." });

            res.json({ message: "Menu item restored successfully", item: menuData.menu[itemIndex] });
        });
    });
});

/* Exporterar modulen så att den kan användas i andra filer */
module.exports = router;

/* const menuController = require("../controllers/menuController");
const db = require("../database/database"); */

/* Fetch all menu items
router.get("/", menuController.getAllMenuItems); DONE

/* Fetch a specific menu item by I
router.get("/:id", menuController.getMenuItemById ); DONE

// Create a new menu item
router.post("/", menuController.createMenuItem); // IGNORE

// Update an existing menu item
router.put("/:id", menuController.updateMenuItem); // DONE

// Delete a menu item
router.delete("/:id", menuController.deleteMenuItem);

// Restore a product
router.put("/restore/:id", menuController.restoreMenuItem);

module.exports = router; */