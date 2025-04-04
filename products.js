const db = require('./database/database');

const menuItems = [
  { title: 'Bryggkaffe', desc: "Bryggd på månadens bönor.", price: 39 },
  { title: 'Caffé Doppio', desc: "Bryggd på månadens bönor.", price: 49 },
  { title: 'Cappuccino', desc: "Bryggd på månadens bönor.", price: 49 },
  { title: 'Latte Macchiato Speciale', desc: "Bryggd på månadens bönor.", price: 40 },
  { title: 'Kaffe Latte', desc: "Bryggd på månadens bönor.", price: 54 },
  { title: 'Cortado', desc: "Bryggd på månadens bönor.", price: 39 }
];

for (const item of menuItems) {
  db.prepare(
    'INSERT INTO menu (title, desc, price, is_deleted) VALUES (?, ?, ?, 0)'
  ).run(item.title, item.desc, item.price);
}

console.log('Meny importerad!');
