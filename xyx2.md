Okay, let's go through each identified issue systematically and provide the specific code changes needed to resolve them.

**1. Fix Duplicate Menu Routes (`server.js`)** Tobias kollar denna

*   **File:** `server.js`
*   **Action:** Remove the route handlers for `/menu` that are defined directly in this file. Keep only the line that uses the dedicated `menuRoutes` file.
*   **Code Changes:**

    ```javascript
    // server.js
    const express = require("express");
    const cors = require("cors");
    const db = require("./database/database");
    const menuRoutes = require("./routes/menuRoutes"); // Keep this
    const userRoutes = require("./routes/userRoutes");
    const ordersRoutes = require("./routes/orders"); // Renamed variable for clarity (see step 2)

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/menu", menuRoutes); // KEEP THIS LINE
    app.use("/user", userRoutes);
    app.use("/order", ordersRoutes); // Use the imported router (see step 2)

    // REMOVE ALL OF THE FOLLOWING BLOCKS from server.js:
    /*
    // Helper function to fetch a product by its ID from the database
    const getProductById = (id) => db.prepare("SELECT * FROM menu WHERE id = ?").get(id);

    // Retrieve all menu items
    app.get("/menu", (req, res) => {
        // ... implementation ...
    });

    // Retrieve a specific product by ID
    app.get("/menu/:id", (req, res) => {
        // ... implementation ...
    });

    // Add a new product to the menu
    app.post("/menu", (req, res) => {
        // ... implementation ...
    });

    // Update an existing product by ID
    app.put("/menu/:id", (req, res) => {
        // ... implementation ...
    });

    // Delete a product by ID
    app.delete("/menu/:id", (req, res) => {
        // ... implementation ...
    });
    */

    // Start the server on port 3000
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(` 🟢 Servern körs på http://localhost:${PORT}`); // Fixed typo http//
    });
    ```

**2. Fix Conflicting/Redundant Order Route Files (`server.js`, `orders.js`, delete `orderRoutes.js`)** Daniel Arvebäck

*   **File:** `server.js`
*   **Action:** Ensure you are importing `orders.js` and using a clear variable name.
*   **Code Changes (in `server.js`):**

    ```javascript
    // server.js
    // ... other imports
    const ordersRoutes = require("./routes/orders"); // Use a clear name like ordersRoutes
    // ...
    app.use("/order", ordersRoutes); // Use the variable
    // ...
    ```

*   **File:** `orderRoutes.js`
*   **Action:** Delete this entire file. Its logic is conflicting and unused based on the `server.js` setup. We will integrate the campaign logic correctly later.

*   **File:** `orders.js`
*   **Action:** Fix the imported function names from `orderController.js`.
*   **Code Changes:**

    ```javascript
    // orders.js
    const express = require("express");
    const router = express.Router();
    // Import the CORRECT function names from the controller
    const {
      createNewOrder, // Changed from createOrder
      getUserOrderHistory, // Changed from getOrderHistory
    } = require("../controllers/orderController");
    // const db = require("../database/database"); // Remove this - controller/model handle DB

    // Skapa ny order
    router.post("/create", createNewOrder); // Use the imported function

    // Hämta orderhistorik för en användare
    router.get("/history/:userId", getUserOrderHistory); // Use the imported function

    module.exports = router;
    ```

**3. Fix Conflicting User Routes (`userRoutes.js`)** Daniel Arvebäck

*   **File:** `userRoutes.js`
*   **Action:** Remove the second block of routes that try to use non-existent controller methods and conflict with the primary routes.
*   **Code Changes:**

    ```javascript
    // userRoutes.js
    const express = require("express");
    const router = express.Router();
    const {
      registerUser,
      loginUser,
      deleteUser,
    } = require("../controllers/userController");
    // const db = require("../database/database"); // Remove this - controller/model handle DB

    // POST /register
    router.post("/register", registerUser);

    // POST /login
    router.post("/login", loginUser);

    // DELETE /delete/:id
    router.delete("/delete/:id", deleteUser);

    // REMOVE ALL OF THE FOLLOWING ROUTES:
    /*
    // grabs all users
    router.get('/users', async (req, res) => {
        // ... implementation ...
    });

    // grabs a specific user
    router.get('/users/:id', async (req, res) => {
        // ... implementation ...
    });

    router.post('/users', async (req, res) => {
        // ... implementation ...
    });
    // updates a user
    router.put('/users/:id', async (req, res) => {
        // ... implementation ...
    });
    // deletes a user
    router.delete('/users/:id', async (req, res) => {
        // ... implementation ...
    });
    */

    module.exports = router;
    ```

**4. Fix Model Bypass in `menuController.js`** Tobias

*   **File:** `menuController.js`
*   **Action:** Replace direct database calls with calls to `MenuModel` static methods. Remove the direct `db` import.
*   **Code Changes:**

    ```javascript
    // menuController.js
    // const db = require("../database/database"); // REMOVE THIS LINE
    const MenuModel = require('../models/menuModel'); // IMPORT THE MODEL

    // Controller function to get all menu items
    const getAllMenuItems = (req, res) => {
        try {
            // Use the model's static method
            const menu = MenuModel.getAll();
            res.json(menu);
        } catch (error) {
            console.error("Error in getAllMenuItems:", error); // Add logging
            res.status(500).json({ error: "Fel vid hämtning av objekt på menyn." });
        }
    };

    // Controller function to get a single menu item by ID
    const getMenuItemById = (req, res) => {
        try {
            // Use the model's static method
            const item = MenuModel.getById(req.params.id);

            item ? res.json(item) : res.status(404).json({ error: "Produkten hittades inte" });
        } catch (error) {
            console.error("Error in getMenuItemById:", error); // Add logging
            res.status(500).json({ error: "Fel vid hämtning av produkten." });
        }
    };

    // Controller function to create a new menu item
    const createMenuItem = (req, res) => {
        const { title, desc, price } = req.body;

        if (!title || !desc || !price) {
            return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
        }

        try {
            // Use the model's static method
            const result = MenuModel.create(title, desc, price);

            res.status(201).json({ id: result.lastInsertRowid, title, desc, price });
        } catch (error) {
            console.error("Error in createMenuItem:", error); // Add logging
            res.status(500).json({ error: "Fel vid skapandet av produkt." });
        }
    };

    // Controller function to update an existing menu item by ID
    const updateMenuItem = (req, res) => {
        const { title, desc, price } = req.body;
        const { id } = req.params; // Get id from params

        if (!title || !desc || !price) {
            return res.status(400).json({ error: "Alla fält (title, desc, price) måste vara ifyllda" });
        }

        try {
            // Use the model's static method
            const result = MenuModel.update(id, title, desc, price);

            result.changes ? res.json({ id: id, title, desc, price })
                           : res.status(404).json({ error: "Produkten hittades inte eller inga ändringar gjordes" }); // Adjusted message
        } catch (error) {
            console.error("Error in updateMenuItem:", error); // Add logging
            res.status(500).json({ error: "Fel vid uppdatering av produkt." });
        }
    };

    // Controller function to delete a menu item by ID (soft delete)
    const deleteMenuItem = (req, res) => {
        try {
            // Use the model's static method
            const result = MenuModel.delete(req.params.id);

            result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har markerats som borttagen.` })
                           : res.status(404).json({ error: "Produkten hittades inte" });
        } catch (error) {
            console.error("Error in deleteMenuItem:", error); // Add logging
            res.status(500).json({ error: "Fel vid borttagning av produkt." });
        }
    };

    // Controller function to restore a deleted menu item by ID
    const restoreMenuItem = (req, res) => {
        try {
            // Use the model's static method
            const result = MenuModel.restore(req.params.id);

            result.changes ? res.json({ message: `Produkt med ID ${req.params.id} har återställts.` })
                           : res.status(404).json({ error: "Produkten hittades inte eller var inte borttagen" }); // Adjusted message
        } catch (error) {
            console.error("Error in restoreMenuItem:", error); // Add logging
            res.status(500).json({ error: "Fel vid återställning av produkt." });
        }
    };

    // Export all controller functions
    module.exports = {
        getAllMenuItems,
        getMenuItemById,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        restoreMenuItem,
    };
    ```

**5. Integrate Campaign Logic (`orderController.js`, `orderModel.js`, Database)** Julia Rasmusson

*   **File:** `orderController.js`
*   **Action:** Import and call `applyCampaign`. Pass discount info to the model. Update the response.
*   **Code Changes:**

    ```javascript
    // orderController.js
    const { createOrder, getOrderHistory } = require("../models/orderModel");
    const { applyCampaign } = require("./campaignController"); // Import campaign logic
    const db = require("../database/database"); // Keep for fetching product details if needed for campaign

    // Helper function (you might already have one or need one)
    // Assumes applyCampaign needs full item details including price
    const getProductDetailsForCart = (items) => {
      const detailedItems = items.map(item => {
          const product = db.prepare("SELECT id, title, price FROM menu WHERE id = ?").get(item.id);
          if (!product) {
              throw new Error(`Product with ID ${item.id} not found during cart processing.`);
          }
          return { ...item, price: product.price, name: product.title }; // Add price and name needed by applyCampaign
      });
      return detailedItems;
    }

    // Skapa ny order
    const createNewOrder = async (req, res) => { // Mark as async if needed later, though model is sync now
        const { userId, items } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ error: "Order måste innehålla en användare och minst en produkt" });
        }

        try {
            // 1. Get full item details including current price for calculations
            const detailedCartItems = getProductDetailsForCart(items);

            // 2. Calculate original total price
            const originalTotalPrice = detailedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // 3. Apply campaign logic
            const { discount, discountMessage } = applyCampaign(detailedCartItems); // Pass detailed items
            const finalTotal = originalTotalPrice - discount;

            // 4. Create order using the model
            // Pass all necessary info, including calculated values
            const orderResult = await createOrder(userId, detailedCartItems, originalTotalPrice, discount, finalTotal);

            // 5. Send response
            res.status(201).json({
                message: "Order skapad",
                orderId: orderResult.orderId,
                originalTotal: originalTotalPrice,
                discountApplied: discountMessage || "Ingen rabatt tillämpad",
                discountAmount: discount,
                finalTotal: finalTotal,
             });

        } catch (error) {
            console.error("Error creating order:", error);
            // Check for specific product not found error from helper function
             if (error.message.startsWith('Product with ID')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Kunde inte skapa order. Försök igen senare." });
        }
    };

    // Hämta orderhistorik för en användare
    const getUserOrderHistory = async (req, res) => { // Mark as async if needed later
        try {
            const history = await getOrderHistory(req.params.userId); // Use await if model becomes async
            if (!history || history.length === 0) { // Check for null/undefined too
                // Send 200 with empty array or message instead of 404 if user exists but has no orders
                 return res.status(200).json([]); // Or { message: "Ingen orderhistorik hittades" }
            }
            res.json(history);
        } catch (error) {
            console.error("Error fetching order history:", error);
            res.status(500).json({ error: "Kunde inte hämta orderhistorik. Försök igen senare." });
        }
    };

    module.exports = { createNewOrder, getUserOrderHistory };

    ```

*   **File:** `orderModel.js`
*   **Action:** Update `createOrder` to accept and store discount/final price. Adjust the `INSERT` statement.
*   **Code Changes:**

    ```javascript
    // orderModel.js
    const db = require("../database/database");

    // Skapa en ny order
    const createOrder = (userId, items, originalTotalPrice, discount, finalTotal) => { // Add parameters
        // No need for Promise wrapper with better-sqlite3
        try {
            // Use transaction for atomicity (insert into orders and order_items)
            db.transaction(() => {
                const orderStmt = db.prepare(`
                    INSERT INTO orders (user_id, totalPrice, discount, finalTotal)
                    VALUES (?, ?, ?, ?)
                `); // Add discount, finalTotal columns
                const result = orderStmt.run(userId, originalTotalPrice, discount, finalTotal); // Add values
                const orderId = result.lastInsertRowid;

                if (!orderId) {
                    throw new Error("Kunde inte skapa order (fick inget orderId)");
                }

                // Lagra orderns produkter
                const insertItemStmt = db.prepare(`
                    INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
                    VALUES (?, ?, ?, ?)
                `); // Consider adding price_at_order
                items.forEach(item => {
                     // Use item.id and item.quantity from the detailed cart items
                     // Store the price *at the time of the order*
                    insertItemStmt.run(orderId, item.id, item.quantity, item.price);
                });

                // If transaction successful, return orderId (or more info if needed)
                // Note: Cannot directly return from inside transaction in better-sqlite3 easily.
                // We rely on it throwing an error on failure.
                // Store orderId in a variable accessible outside if needed, or just return it here.
                 global.lastOrderId = orderId; // Hacky way, better to restructure if possible

            })(); // Immediately execute the transaction

             return { orderId: global.lastOrderId }; // Return the ID

        } catch (error) {
            console.error("Database error in createOrder:", error);
            throw error; // Re-throw the error to be caught by the controller
        }
    };

    // Hämta orderhistorik för en användare
    const getOrderHistory = (userId) => {
         // No need for Promise wrapper
        try {
            // Make sure column names (user_id, product_id, etc.) match your schema
             // Also fetch discount info if needed
            const query = `
                SELECT
                    o.id AS orderId, o.totalPrice AS originalTotal, o.discount, o.finalTotal, o.created_at,
                    oi.quantity, oi.price_at_order,
                    m.title AS productTitle
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN menu m ON oi.product_id = m.id
                WHERE o.user_id = ?
                ORDER BY o.created_at DESC, o.id, m.title`; // Added ordering

            const rows = db.prepare(query).all(userId);

            // Optional: Group results by orderId if desired
            const historyByOrder = {};
            rows.forEach(row => {
                if (!historyByOrder[row.orderId]) {
                    historyByOrder[row.orderId] = {
                        orderId: row.orderId,
                        originalTotal: row.originalTotal,
                        discount: row.discount,
                        finalTotal: row.finalTotal,
                        createdAt: row.created_at,
                        items: []
                    };
                }
                historyByOrder[row.orderId].items.push({
                    title: row.productTitle,
                    quantity: row.quantity,
                    priceAtOrder: row.price_at_order
                });
            });

            return Object.values(historyByOrder); // Return array of orders

        } catch (error) {
            console.error("Database error in getOrderHistory:", error);
            throw error; // Re-throw
        }
    };

    // Radera en order (Keep as is, or use transaction)
    const deleteOrder = (orderId) => {
        // No need for Promise wrapper
        try {
             db.transaction(() => {
                db.prepare("DELETE FROM order_items WHERE order_id = ?").run(orderId);
                const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);

                if (!result.changes) {
                     // Throw error inside transaction to cause rollback if order not found
                    throw new Error("Order hittades inte");
                }
            })();
             return { message: "Order raderad" };
        } catch (error) {
             console.error("Database error in deleteOrder:", error);
             if (error.message === "Order hittades inte") {
                 throw error; // Re-throw specific error
             }
             throw new Error("Kunde inte radera order"); // Generic error
        }
    };


    module.exports = { createOrder, getOrderHistory, deleteOrder };

    ```

*   **Database Schema:**
*   **Action:** You **MUST** ensure your `orders` table has the `discount` and `finalTotal` columns. You might also want `price_at_order` in `order_items`.
*   **SQL (Example - run this directly on your database if needed):**
    ```sql
    ALTER TABLE orders ADD COLUMN discount REAL DEFAULT 0;
    ALTER TABLE orders ADD COLUMN finalTotal REAL; -- Calculate before insert
    -- Optional: Add price snapshot to order_items
    ALTER TABLE order_items ADD COLUMN price_at_order REAL;
    ```
    *You might need to adjust `REAL` to `INTEGER` or `NUMERIC` depending on how you store prices.*

**6. Standardize Column Naming (`userId` vs. `user_id`)** Daniel Akestam

*   **Action:** Decide on one convention (e.g., `user_id`). Search your codebase (`userModel.js`, `orderModel.js`, any other direct SQL) and ensure consistency. Let's assume `user_id`.
*   **File:** `userModel.js`
*   **Code Changes (if it used `userId`):**
    ```javascript
    // userModel.js
    // ...
    const deleteUserById = (id) => {
      // ...
      const deleteOrders = "DELETE FROM orders WHERE user_id = ?"; // Ensure this uses user_id
      // ...
    };
    // ...
    ```
*   **File:** `orderModel.js`
*   **Code Changes (already seems to use `user_id`, verify):**
    ```javascript
    // orderModel.js
    // ...
    const createOrder = (userId, items, originalTotalPrice, discount, finalTotal) => {
        // ...
        const orderStmt = db.prepare(`
            INSERT INTO orders (user_id, totalPrice, discount, finalTotal)
            VALUES (?, ?, ?, ?)
        `); // Verify user_id is correct schema name
        // ...
    }
    // ...
    const getOrderHistory = (userId) => {
        // ...
        const query = `... WHERE o.user_id = ?`; // Verify user_id is correct schema name
        // ...
    }
    // ...
    ```
*   **Database Schema:** Double-check the `orders` table schema to confirm the foreign key column is indeed named `user_id`.

**7. Simplify Models (Remove Promises)** Daniel Akestam

*   **Action:** Remove `new Promise` wrappers from `userModel.js` and `orderModel.js` as `better-sqlite3` is synchronous. Use `try...catch` if needed for specific model-level error handling, otherwise let errors propagate.
*   **File:** `userModel.js`
*   **Code Changes:**

    ```javascript
    // usermodel.js
    const db = require("../database/database");

    const createUser = (id, username, hashedPassword) => {
        // No Promise wrapper
        try {
            const query = "INSERT INTO users (id, username, password) VALUES (?, ?, ?)";
            // .run doesn't return the user object directly, just info
            const result = db.prepare(query).run(id, username, hashedPassword);
            // You might want to fetch the user after creation if needed, or just return success/id
            // return { id, username }; // Assuming id is passed in correctly
             return { id: result.lastInsertRowid, username }; // Or use lastInsertRowid if ID is auto-gen
        } catch (err) {
            console.error("Error in createUser:", err);
            throw err; // Re-throw for controller
        }
    };

    const findUserByUsername = (username) => {
        // No Promise wrapper
        try {
            const query = "SELECT * FROM users WHERE username = ?";
            const row = db.prepare(query).get(username);
            return row; // Returns the user object or undefined
        } catch (err) {
            console.error("Error in findUserByUsername:", err);
            throw err; // Re-throw
        }
    };

    const deleteUserById = (id) => {
        // No Promise wrapper
        try {
             // Use transaction
             db.transaction(() => {
                const deleteOrders = "DELETE FROM orders WHERE user_id = ?"; // ensure name is correct
                db.prepare(deleteOrders).run(id);

                const deleteUser = "DELETE FROM users WHERE id = ?";
                const result = db.prepare(deleteUser).run(id);

                if (result.changes === 0) {
                    // Optional: Throw if user didn't exist to delete
                    throw new Error('Användare hittades inte för radering.');
                }
            })(); // Execute transaction
             return { success: true };

        } catch (err) {
            console.error("Error in deleteUserById:", err);
            throw err; // Re-throw
        }
    };

    module.exports = {
        createUser,
        findUserByUsername,
        deleteUserById,
    };
    ```

*   **File:** `orderModel.js`
*   **Action:** Changes already applied in Step 5. Verify no `new Promise` wrappers remain.

**8. Clean Up Unused Code/Files**

*   **File:** `middleware.js`
*   **Action:** Delete this file, as it seems unrelated to the main application structure.

*   **File:** `orderController.js`
*   **Action:** Delete the large commented-out block if it's truly redundant.
    *   *(Self-correction: The commented block seems identical, so safe to remove)*.

*   **Files:** `userRoutes.js`, `orders.js`, `menuRoutes.js`, `campaignRoutes.js`, `userController.js`
*   **Action:** Review each file and remove any `const db = require(...)` lines if `db` is no longer directly used (it should primarily be used only in Models now).
    *   `userRoutes.js`: Remove `db` import.
    *   `orders.js`: Remove `db` import.
    *   `menuRoutes.js`: Remove `db` import.
    *   `campaignRoutes.js`: Remove `db` import (controller uses model).
    *   `userController.js`: Remove `db` import (controller uses model).
    *   `orderController.js`: *Keep* `db` import *if* needed for the `getProductDetailsForCart` helper. If that helper moves to the model layer, remove the import here too.

---

After making these changes, **thoroughly test** all API endpoints (menu CRUD, user registration/login/delete, order creation, order history, campaigns) to ensure everything works as expected and the conflicts are resolved.