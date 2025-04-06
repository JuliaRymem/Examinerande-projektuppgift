# Airbean API

## Beskrivning
Airbean API är ett REST API byggt med Express.js och better-sqlite3 för att hantera en meny med kaffedrycker. API:et möjliggör CRUD-operationer (Create, Read, Update, Delete) samt "soft delete"-funktionalitet. Det innehåller också kampanjhantering för att erbjuda rabatter baserat på specifika regler. Dessutom hanterar API:et användarhantering och orderhistorik.

---

## Funktioner
- Hämta hela menyn
- Hämta en specifik produkt
- Lägga till en ny produkt
- Uppdatera en befintlig produkt
- Ta bort en produkt (soft delete)
- Återställa en borttagen produkt
- Hämta aktiva kampanjer
- Applicera kampanjer på en varukorg
- Hantera användare (skapa, hämta, uppdatera och ta bort användare)
- Hantera ordrar (skapa och hämta orderhistorik)
  
---

## Middleware
API:et använder en middleware för att logga alla inkommande requests samt en autentiseringsmiddleware för att begränsa åtkomst till vissa sidor.

### Logging Middleware
Loggar alla inkommande förfrågningar med tidsstämpel.

```function middleware(req, res, next) {
    console.log(`${new Date().toISOString()}: ${req.originalUrl}`);
    next();
}
```
### Autentiseringsmiddleware
Begränsar åtkomst till vissa endpoints baserat på query-parametern admin=true.

```function authAccess(req, res, next) {
    if (req.query.admin === 'true') {
        req.admin = true;    
        next();
    } else {
        res.send('Fel: Du måste vara en admin');
    }
}
```

## Teknologier
- **Node.js** (Backend-runtime)
- **Express.js** (Webbramverk)
- **better-sqlite3** (Databashantering)
- **cors** (Cross-Origin Resource Sharing)
- **nodemon** (Utvecklingsverktyg)

---

## Systemkrav
Innan du börjar, se till att du har följande installerat:
- [Node.js](https://nodejs.org/) (version 16 eller senare rekommenderas)
- npm (ingår i Node.js)
- En modern webbläsare

---

## Installation & Användning

### 1. Klona detta repository:
```sh
   git clone https://github.com/Tobias-Thor/Airbean-API.git
```

### 2. Navigera till projektmappen:
```sh
   cd Airbean-API
```

### 3. Installera beroenden:
```sh
   npm install
```

### 4. Starta utvecklingsservern:
```sh
   npm start  # eller använd npm run dev för nodemon
```

Nu kan du använda API:et via `http://localhost:3000/`

---

## API-Endpoints

### Hämta hela menyn
**GET** `/menu`

**Svarsexempel:**
```json
[
  {
    "id": 1,
    "title": "Bryggkaffe",
    "desc": "Bryggd på månadens bönor.",
    "price": 39
  }
]
```

---

### Hämta en specifik produkt
**GET** `/menu/:id`

**Svarsexempel:**
```json
{
  "id": 1,
  "title": "Bryggkaffe",
  "desc": "Bryggd på månadens bönor.",
  "price": 39
}
```

---

### Lägga till en ny produkt
**POST** `/menu`

**Body (JSON):**
```json
{
  "title": "Espresso",
  "desc": "En stark och fyllig espresso.",
  "price": 45
}
```

---

### Uppdatera en produkt
**PUT** `/menu/:id`

**Body (JSON):**
```json
{
  "title": "Uppdaterat namn",
  "desc": "Ny beskrivning",
  "price": 50
}
```

---

### Ta bort en produkt (soft delete)
**DELETE** `/menu/:id`

**Svarsexempel:**
```json
{
  "message": "Produkt med ID 1 har markerats som borttagen."
}
```

---

### Återställa en borttagen produkt
**PUT** `/menu/restore/:id`

**Svarsexempel:**
```json
{
  "message": "Produkt med ID 1 har återställts."
}
```

---

### Hämta aktiva kampanjer

**GET** /campaigns

**Svarsexempel:**
[
```{
    "id": 1,
    "name": "Köp 2 bryggkaffe, få en gratis",
    "productId": 1,
    "discountType": "buy2get1",
    "discountValue": 100,
    "isActive": 1
  }
]
```

### Hantera ordrar
Skapa en ny order

```POST /create```

Hämta orderhistorik för en användare

```GET /history/:userId```

---

## Databas
API:et använder SQLite via better-sqlite3 och har följande tabeller:
-users (för användarhantering)
-orders (för orderhistorik)
-menu (för kaffemenyn)

---

## Websockets - En diskussion
-"Om ni skulle implementera websockets i detta projekt, beskriv vilken
funktionalitet det skulle ge användaren och vilket mervärde det skulle
tillföra."

---

## Projektmedlemmar och kontaktuppgifter
### Daniel Akestam
- **GitHub**: [Luckmore83] (https://github.com/Luckmore83)
### Julia Rasmusson
- **GitHub**: [JuliaRymem] (https://github.com/JuliaRymem)
### Daniel Arvebäck
- **GitHub**: [Danielarveb] (https://github.com/Danielarveb)
### Tobias Thor
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **E-post**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)

