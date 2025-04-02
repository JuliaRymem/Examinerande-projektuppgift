const express = require('express')
const app = express()

app.use(middleware)

app.get('/', (req, res) => {
    res.send('Airbean API')
})

app.get('/users', authAccess, (req, res) => {
    console.log(req.admin)
    res.send('Användarsida')
})

function middleware(req, res, next) {
    console.log(`${new Date().toISOString()}: ${req.originalUrl}`)
    next()
}

function authAccess(req, res, next) {
    if (req.query.admin === 'true') {
    req.admin = true    
    next()
    } else {
        res.send('Fel: Du måste vara en admin')
    }
}

app.listen(3000, () => console.log('Servern är igång'))

//Startar en express-server på port 3000
//Loggar alla requests via en middleware
//visar "Airbean API"
//