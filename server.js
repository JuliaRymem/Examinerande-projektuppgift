const express = require("express");

/* CORS (middleware) för säkerhet */
const cors = require("cors");

/* Hänvisar till databasfilen */
const db = require("./database/database"); // BEHÖVS DENNA KODRAD?

/* Importerar olika routemoduler */
const menuRoutes = require("./routes/menuRoutes"); 
const userRoutes = require("./routes/userRoutes"); 
const orderRoutes = require("./routes/orders"); 
const campaignRoutes = require("./routes/campaignRoutes"); 

/* fil-system-modul (läsa, skriva, radera filer) */
const fs = require("fs"); // BEHÖVS DENNA KODRAD?

/* Skapar en ny Express-app  */
const app = express();

/* Lägger till och aktiverar CORS (middleware) */
app.use(cors()); 

/* Middleware som gör att servern automatiskt 
kan tolka inkommande JSON-data från klienter */
app.use(express.json()); 

/* Routes */
app.use("/menu", menuRoutes); 
app.use("/user", userRoutes); 
app.use("/order", orderRoutes); 

/* När någon försöker komma åt /campaign, körs
en middleware som loggar "Campaign route accessed" till 
terminalen, och ser till att requesten går vidare 
till campaignRoutes */
app.use("/campaign", (req, res, next) => {
    console.log("Campaign route accessed");
    next();
}, campaignRoutes);
/* Hanterar förfrågningar till huvudsidan */
app.get('/', (req, res) => {
    res.send('Välkommen till huvudsidan!');
});
  
/* Startar servern på port 3000 och loggar ett meddelande */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` 🟢 Servern körs på http://localhost:${PORT}`);
});