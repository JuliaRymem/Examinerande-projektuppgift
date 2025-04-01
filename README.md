# Airbean API

## Beskrivning
Airbean API är ett REST API byggt med Express.js och better-sqlite3 för att hantera en meny med kaffedrycker. API:et möjliggör CRUD-operationer (Create, Read, Update, Delete) samt "soft delete"-funktionalitet.

---

## Funktioner
- Hämta hela menyn
- Hämta en specifik produkt
- Lägga till en ny produkt
- Uppdatera en befintlig produkt
- Ta bort en produkt (soft delete)
- Återställa en borttagen produkt

---

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

## API-Endpunkter

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

## Kontakt
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **E-post**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)

