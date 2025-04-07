# Airbean API

## Beskrivning
Airbean API är ett REST API byggt med Express.js och better-sqlite3 för att hantera en meny med kaffedrycker. API:et möjliggör CRUD-operationer (Create, Read, Update, Delete) samt "soft delete"-funktionalitet (för menyn). Det innehåller också kampanjhantering för att erbjuda rabatter baserat på specifika regler. Dessutom hanterar API:et användarhantering och orderhistorik, och även validering via middleware för att säkerställa att inkommande data är korrekt formaterad.

---

## Funktioner

### Meny:
- Hämta hela menyn
- Hämta en specifik produkt
- Lägga till, uppdatera och ta bort (soft delete) produkter
- Återställa borttagna produkter

### Kampanjer:
- Hämta aktiva kampanjer
- Skapa, uppdatera och inaktivera kampanjer
- Möjlighet att applicera kampanjrabatter vid orderläggning

### Användare:
- Skapa nya användarkonton med slumpgenererat användar-ID (UUID)
- Hämta, uppdatera och ta bort användare
- Orderhistorik hämtas via användar-ID

### Ordrar:
- Skapa nya ordrar med full validering av produkter, kvantitet och pris
- Hämta orderhistorik för en användare
- Radera en order
  
---

## Middleware
API:et använder flera middleware-komponenter:

### Logging Middleware
Loggar alla inkommande förfrågningar (requests) med tidsstämpel.

```
function middleware(req, res, next) {
    console.log(`${new Date().toISOString()}: ${req.originalUrl}`);
    next();
}
```

### Valideringsmiddleware
Olika middleware-funktioner säkerställer att data i URL och body är korrekt formaterad, t.ex. att:

- Alla nödvändiga fält (t.ex. namn, email, lösenord) är ifyllda vid användarskapande.
- Ordern innehåller giltiga produkt-ID:n, kvantiteter och priser.
- Endast produkter som finns i menyn kan läggas till i en order.

## Teknologier
- **Node.js** (Backend-runtime)
- **Express.js** (Webbramverk)
- **better-sqlite3** (Databashantering)
- **cors** (Cross-Origin Resource Sharing)
- **nodemon** (Utvecklingsverktyg)
- **curl** (CLI-verktyg)
- **bcrypt** (Krypteringsverktyg)
- **uuidv4** (För slumpgenereade användar-id)
- **body-parser** (Middleware-paket)

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
   git clone https://github.com/JuliaRymem/Examinerande-projektuppgift
```

### 2. Navigera till projektmappen:
```sh
   cd Examinerande-projektuppgift
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

```
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

**PATCH** `/menu/:id/restore`

**Svarsexempel:**
```json
{
  "message": "Produkt med ID 1 har återställts."
}
```

---

### Hämta aktiva kampanjer

**GET** /campaign

**Svarsexempel:**

```
  {
    "id": 1,
    "name": "Köp 2 bryggkaffe, få en gratis",
    "productId": 1,
    "discountType": "buy2get1",
    "discountValue": 100,
    "isActive": 1
  }
```
### Skapa en ny kampanj

**POST** /campaign

**Svarsexempel:**

```
  {
  "title": "Ny kampanj",
  "discount": 20,
  "productId": 2,
  "startDate": "2025-06-01",
  "endDate": "2025-06-30"
  }
```

### Uppdatera en kampanj

**PUT** /campaign/:id

**Svarsexempel:**


```
  {
  "title": "Uppdaterad kampanj",
  "discount": 25,
  "productId": 2,
  "startDate": "2025-06-01",
  "endDate": "2025-06-30",
  "isActive": 1
  }
```

### Inaktivera (ta bort) en kampanj

**DELETE** /campaign/:id

**Svarsexempel:**


```
  {
  "message": "Kampanj inaktiverad (borttagen)!"
}
```

### Hämta alla användare

**GET** /users
- Hämta en specifik användare

**GET** /users/:id
- Uppdatera en användare

**PUT** /users/:id

**Svarsexempel:**


```
  {
  "name": "Uppdaterat Namn",
  "email": "nyemail@example.com"
}
```

### Ta bort en användare

**DELETE** /users/:id


### Skapa en ny order

**POST** /order/create

**Svarsexempel:**


```
  {
  "userId": "user-uuid",
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "price": 39
    }
  ]
}
```

### Hämta orderhistorik för en användare

**GET** /order/history/:userId

### Radera en order

**DELETE** /order/:orderId

---

## Databas
API:et använder SQLite via better-sqlite3 och har följande tabeller:

### Tabeller
- users (för användarhantering)
- menu (för kaffemenyn)
- campaigns (kampanjer med rabatter)
- orders (för orderhistorik)
- order_items – (detaljer per order, koppling mellan order och produkter)

---

## WebSockets – En diskussion om funktionalitet och mervärde i projektet
Om vi skulle implementerat WebSockets i vårt projekt, skulle det möjliggöra kommunikation i realtid mellan servern och klienten. Det hade inneburit att vi kunnat skicka och ta emot data direkt, utan att användaren behövt uppdatera sidan eller skicka nya HTTP-förfrågningar.

### Exempel på funktionalitet:

- **Uppdatering av orderstatus:** När en användare har lagt en beställning skulle de kunna se orderstatus uppdateras i realtid, exempelvis "Mottagen", "Tillagas" och "Redo att hämtas". Användaren slipper ladda om sidan eller trycka på uppdatera.
- **Notiser vid kampanjer:** Nya kampanjer skulle kunna skickas ut direkt till alla användare som är inne i appen.
- **Lageruppdateringar:** Om en produkt tillfälligt tar slut, skulle användare få direkt information om detta under beställningsprocessen.
- **Chattfunktionalitet:** WebSockets skulle kunna användas för att bygga en chattfunktion där kunder kan få direkt hjälp från supporten.

### Mervärde

Att implementera WebSockets i projektet skulle kunna ge flera fördelar för användaren. För det första skulle det skapa en bättre användarupplevelse – som användare slipper man uppdatera sidan manuellt och får en mer interaktiv och dynamisk upplevelse där information kan uppdateras i realtid. Det skulle också ge en effektivare orderhantering, då orderstatus kan följas och uppdateras utan fördröjning.

Det kan också bidra till en snabbare kundsupport genom möjligheten att erbjuda en ”direktchatt”. Notiser om kampanjer eller erbjudanden skulle kunna bidra till ökad försäljning. Det kan öka engagemanget och leda till att användaren snabbare kan ta del av aktuella rabatter.

---

## Projektmedlemmar och kontaktuppgifter
### Daniel Akestam
- **GitHub**: [Luckmore83](https://github.com/Luckmore83)
- **E-post**: [daaksve@gmail.com](mailto:daaksve@gmail.com)
### Julia Rasmusson
- **GitHub**: [JuliaRymem](https://github.com/JuliaRymem)
### Daniel Arvebäck
- **GitHub**: [Danielarveb](https://github.com/Danielarveb)
### Tobias Thor
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **E-post**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)

---

Denna README-fil är tänkt att fungera som en tydlig guide för utvecklare och användare av API:et, 
med uppdaterade endpoints och beskrivningar som motsvarar den nuvarande implementationen.

