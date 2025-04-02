
const db = require("../database");


const createUser = (id, username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO users (id, username, password) VALUES (?, ?, ?)";
    db.run(query, [id, username, hashedPassword], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, username });
      }
    });
  });
};

const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.get(query, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); // Kan bli null om ingen hittas
      }
    });
  });
};

const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    const deleteOrders = "DELETE FROM orders WHERE user_id = ?";
    const deleteUser = "DELETE FROM users WHERE id = ?";

    db.run(deleteOrders, [id], (err) => {
      if (err) {
        return reject(err);
      }

      db.run(deleteUser, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  });
};

module.exports = {
  createUser,
  findUserByUsername,
  deleteUserById,
};


//funktioner
//createUser() Lägger till en ny användare
// findUserByUsername() Hämtar en användare baserat på användarnamn
//DeleteUserById() Tar bort både användaren och dess ordrar (viktigt för datarensning)