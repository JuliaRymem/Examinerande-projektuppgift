const MenuModel = require("../models/menuModel");

const getAllMenuItems = (req, res) => {
    const menu = MenuModel.getAll();
    res.json(menu);
};

const getMenuItemById = (req, res) => {
    const item = MenuModel.getById(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: "Produkt hittades inte"});
};

const createMenuItem = (req, res) => {
    const { title, desc, price } = req.body;
    const result = MenuModel.create(title, desc, price);
    res.json({ id: result.lastInsertRowId, title, desc, price });
};

const updateMenuItem = (req, res) => {
    const { title, desc, price } = req.body;
    const result = MenuModel.update(req.params.id, title, desc, price);
    result.changes ? res.json({ id: req.params.id, title, desc, price}) : res.status(404).json({ error: "Produkt hittades inte" });
};

const deleteMenuItem = (req, res) => {
    const result = MenuModel.delete(req.params.id);
    result.changes ? res.json({ message: "Produkten har tagits bort"}) : res.status(404).json({ error: "Produkt hittades inte"});
};

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
};