/* Importerar en databasanslutning */
const db = require("../database/database");

/* Klassen MenuModel innehåller metoder för att hantera menyalternativ i databasen */
class MenuModel {
    /* Hämtar alla menyalternativ */
    static getAll() {
        /* Förbereder en SQL-fråga som hämtar alla rader från tabellen menu och
        ser till att bara aktiva objekt hämtas ( och inte sådana som har "soft-deletats"), 
        Kör SQL-frågan och returnerar alla matchande rader från databasen som en array (lista) */
        return db.prepare("SELECT * FROM menu WHERE is_deleted = FALSE").all();
    }

    /* Hämtar en specifik menyprodukt baserat på ID */
    static getById(id) {
        /* Hämtar en rad från menu där id matchar det man letar efter,
        is_deleted = FALSE ser till att man inte returnerar en raderad 
        produkt, ? är en platsmarkör, och innebär att värdet skickas in 
        senare (för att förhindra SQL-injektion (SÄKERHET!) */
        return db.prepare("SELECT * FROM menu WHERE id = ? AND is_deleted = FALSE").get(id);
    }

    /* Metod för att lägga till en ny menyprodukt i databasen */
    static create(title, desc, price) {
        /* Lägger till en ny rad i menu-tabellen, och ? används 
        som platsmarkör för att förhindra SQL-injektion */
        const stmt = db.prepare("INSERT INTO menu (title, desc, price) VALUES (?, ?, ?)");
        /* Kör frågan med de inskickade värdena */
        return stmt.run(title, desc, price);
    }

    /* Uppdaterar en befintlig menyprodukt baserat på id */
    static update(id, title, desc, price) {
        /* Ändrar värdena på title, desc och price för den rad där id matchar */
        const stmt = db.prepare("UPDATE menu SET title = ?, desc = ?, price = ? WHERE id = ?");
        /* Kör frågan med de angivna värdena */
        return stmt.run(title, desc, price, id);
    }

    /* "Mjuk borttagning" ("Soft delete") av en produkt */
    /* Istället för att ta bort en produkt helt från databasen, 
       markeras den som borttagen med is_deleted = TRUE, Det gör 
       att den kan återställas senare */
    static delete(id) {
        const stmt = db.prepare("UPDATE menu SET is_deleted = TRUE WHERE id = ?");
        return stmt.run(id);
    }

    /* Återställer en raderad produkt genom att sätta is_deleted = FALSE */
    static restore(id) {
        /* Ändrar is_deleted tillbaka till FALSE, och då syns produkten igen */
        const stmt = db.prepare("UPDATE menu SET is_deleted = FALSE WHERE id = ?");
        return stmt.run(id);
    }
}

/* Exporterar klassen så att den kan användas i andra filer */
module.exports = MenuModel;