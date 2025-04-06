const express = require('express');
const app = express();

// Läser in JSON-data från inkommande förfrågningar
app.use(express.json());

// Global logging-middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  next();
});

// Importera routes
const ordersRouter = require('./routes/Orders');
const usersRouter = require('./routes/UserRoutes'); // r
const menuRouter = require('./routes/MenuRoutes'); // r
const campaignRouter = require('./routes/CampaignRoutes'); // r

// Använd routes
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