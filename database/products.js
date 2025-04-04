const db = require('./database/database');

const menuItems = [
  { title: 'Margherita Pizza', price: 89.0 },
  { title: 'Kebab Pizza', price: 99.0 },
  { title: 'Cola', price: 20.0 }
];

for (const item of menuItems) {
  db.prepare(
    'INSERT INTO menu (title, price, is_deleted) VALUES (?, ?, 0)'
  ).run(item.title, item.price);
}

console.log('Meny importerad!');