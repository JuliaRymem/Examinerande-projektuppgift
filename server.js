// Importerar nödvändiga moduler
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Middleware för att logga inkommande förfrågningar 
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  next();
});

// Importerar routes 
const orderRoutes = require('./routes/orders'); // Ny kod 
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/userRoutes');
const menuRouter = require('./routes/menuRoutes');
const campaignRouter = require('./routes/campaignRoutes');

// Använder routes 
app.use('/order', ordersRouter);
app.use('/users', usersRouter);
app.use('/menu', menuRouter);
app.use('/campaign', campaignRouter);
app.use("/orders", orderRoutes)

app.get('/', (req, res) => {
  res.type('text').send(
    'Välkommen till huvudsidan!\n' +
    '/users – Användarsida\n' +
    '/menu – Meny\n' +
    '/order – Order\n' +
    '/campaign – Kampanjer'
  );
});

// Startar servern på angiven port 3000 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servern är igång på port ${PORT}`));
