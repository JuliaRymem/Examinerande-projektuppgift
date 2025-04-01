# Airbean API

## Svenska (SCROLL DOWN FOR INSTRUCTIONS IN ENGLISH)

## Beskrivning
Airbean API är ett REST API byggt med Express.js och better-sqlite3 för att hantera en meny med kaffedrycker. API:et möjliggör CRUD-operationer (Create, Read, Update, Delete) samt "soft delete"-funktionalitet. Det innehåller också kampanjhantering för att erbjuda rabatter baserat på specifika regler.

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

### Hämta aktiva kampanjer
**GET** `/campaigns`

**Svarsexempel:**
```json
[
  {
    "id": 1,
    "name": "Köp 2 bryggkaffe, få en gratis",
    "productId": 1,
    "discountType": "buy2get1",
    "discountValue": 100,
    "isActive": 1
  }
]
```

---

## Kampanjhantering
API:et hanterar kampanjer som kan appliceras på varukorgen baserat på fördefinierade regler. Exempelvis kan en kampanj innebära "köp 2, få 1 gratis".

---

## Projektmedlemmar och kontaktuppgifter
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **E-post**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)

---

# Airbean API

## English (SCROLL UP FOR INSTRUCTIONS IN SWEDISH)

## Description
Airbean API is a REST API built with Express.js and better-sqlite3 to manage a menu of coffee beverages. The API enables CRUD operations (Create, Read, Update, Delete) as well as "soft delete" functionality. It also includes campaign management to provide discounts based on specific rules.

---

## Features
- Retrieve the entire menu
- Retrieve a specific product
- Add a new product
- Update an existing product
- Delete a product (soft delete)
- Restore a deleted product
- Retrieve active campaigns
- Apply campaigns to a shopping cart

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

### Retrieve active campaigns
**GET** `/campaigns`

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Buy 2 drip coffee, get one free",
    "productId": 1,
    "discountType": "buy2get1",
    "discountValue": 100,
    "isActive": 1
  }
]
```

---

## Campaign Management
The API manages campaigns that can be applied to the shopping cart based on predefined rules. For example, a campaign might involve "buy 2, get 1 free".

---

## Contact
- **GitHub**: [Tobias-Thor](https://github.com/Tobias-Thor)
- **LinkedIn**: [Tobias Thor](https://www.linkedin.com/in/tobias-thor-810215182/)
- **Email**: [tobiasthor@protonmail.com](mailto:tobiasthor@protonmail.com)

