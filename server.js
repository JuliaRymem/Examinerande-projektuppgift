// Importerar nödvändiga moduler
const express = require('express');
const app = express();

// Läser in JSON-data från inkommande förfrågningar
app.use(express.json());

// Middleware för att logga inkommande förfrågningar
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  next();
});

// Importerar routes
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/userRoutes');
const menuRouter = require('./routes/menuRoutes');
const campaignRouter = require('./routes/campaignRoutes');

// Använder routes
app.use('/order', ordersRouter);
app.use('/users', usersRouter);
app.use('/menu', menuRouter);
app.use('/campaign', campaignRouter);

app.get('/', (req, res) => {
    res.type('text').send(
        'Välkommen till huvudsidan!\n' +
        '/users – Gå till användarsidan\n' +
        '/menu – Se menyn'
      );
    });
    
// Startar servern på port 3000
app.listen(3000, () => console.log('Servern är igång på port 3000'));