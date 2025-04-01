# Airbean API

## Svenska (SCROLL DOWN FOR INSTRUCTIONS IN ENGLISH)

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

## Projektmedlemmar och kontaktuppgifter
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **E-post**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)

---

# Airbean API 

## English (SCROLL UP FOR INSTRUCTIONS IN SWEDISH)

## Description
Airbean API is a REST API built with Express.js and better-sqlite3 to manage a menu of coffee beverages. The API enables CRUD operations (Create, Read, Update, Delete) as well as "soft delete" functionality.

---

## Features
- Retrieve the entire menu
- Retrieve a specific product
- Add a new product
- Update an existing product
- Delete a product (soft delete)
- Restore a deleted product

---

## Technologies
- **Node.js** (Backend runtime)
- **Express.js** (Web framework)
- **better-sqlite3** (Database management)
- **cors** (Cross-Origin Resource Sharing)
- **nodemon** (Development tool)

---

## System Requirements
Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- npm (included with Node.js)
- A modern web browser

---

## Installation & Usage

### 1. Clone this repository:
```sh
   git clone https://github.com/Tobias-Thor/Airbean-API.git
```

### 2. Navigate to the project folder:
```sh
   cd Airbean-API
```

### 3. Install dependencies:
```sh
   npm install
```

### 4. Start the development server:
```sh
   npm start  # or use npm run dev for nodemon
```

Now you can use the API via `http://localhost:3000/`

---

## API Endpoints

### Retrieve the entire menu
**GET** `/menu`

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Drip Coffee",
    "desc": "Brewed with this month's beans.",
    "price": 39
  }
]
```

---

### Retrieve a specific product
**GET** `/menu/:id`

**Response Example:**
```json
{
  "id": 1,
  "title": "Drip Coffee",
  "desc": "Brewed with this month's beans.",
  "price": 39
}
```

---

### Add a new product
**POST** `/menu`

**Body (JSON):**
```json
{
  "title": "Espresso",
  "desc": "A strong and rich espresso.",
  "price": 45
}
```

---

### Update a product
**PUT** `/menu/:id`

**Body (JSON):**
```json
{
  "title": "Updated Name",
  "desc": "New description",
  "price": 50
}
```

---

### Delete a product (soft delete)
**DELETE** `/menu/:id`

**Response Example:**
```json
{
  "message": "Product with ID 1 has been marked as deleted."
}
```

---

### Restore a deleted product
**PUT** `/menu/restore/:id`

**Response Example:**
```json
{
  "message": "Product with ID 1 has been restored."
}
```

---

## Contact
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **Email**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)



