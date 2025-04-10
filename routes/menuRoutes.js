// Importerar nödvändiga moduler och middleware
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { validateMenuItem, validateMenuItemId } = require('../middleware/validateMenu');

// Definierar rutter för menyhantering 
router.get('/', menuController.getAllMenuItems);
router.get('/:id', validateMenuItemId, menuController.getMenuItemById);
router.post('/', validateMenuItem, menuController.createMenuItem);
router.put('/:id', validateMenuItemId, validateMenuItem, menuController.updateMenuItem);
router.delete('/:id', validateMenuItemId, menuController.deleteMenuItem);
router.patch('/:id/restore', validateMenuItemId, menuController.restoreMenuItem);

// Exporterar routern för menyhantering 
module.exports = router;
