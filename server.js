const express = require("express");
const cors = require("cors");
const db = require("./database/database");  // ??
const menuRoutes = require("./routes/menuRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orders");
const fs = require("fs");

const app = express();
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) to allow API access from different domains
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use("/menu", menuRoutes);
app.use("/user", userRoutes); // Användar-relaterade routes
app.use("/order", orderRoutes); // Order-relaterade routes
app.use('/', (req, res) => {res.send('Huvudsida');
});
  
// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` 🟢 Servern körs på http://localhost:${PORT}`);
});
