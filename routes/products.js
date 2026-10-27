const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Hämta alla produkter
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// GET - Hämta en produkt
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produkten hittades inte' });
  }
  res.json(product);
});

// POST - Skapa ny produkt
router.post('/', (req, res) => {
  const { name, price, sku, description } = req.body;

  if (!name || price === undefined || !sku) {
    return res.status(400).json({ error: 'Namn, pris och SKU är obligatoriska' });
  }

  if (price <= 0) {
    return res.status(400).json({ error: 'Priset måste vara ett positivt tal' });
  }

  const result = db.prepare(
    'INSERT INTO products (name, price, sku, description) VALUES (?, ?, ?, ?)'
  ).run(name, price, sku, description || null);

  const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newProduct);
});

// PUT - Uppdatera produkt
router.put('/:id', (req, res) => {
  const { name, price, sku, description } = req.body;

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Produkten hittades inte' });
  }

  if (!name || price === undefined || !sku) {
    return res.status(400).json({ error: 'Namn, pris och SKU är obligatoriska' });
  }

  if (price <= 0) {
    return res.status(400).json({ error: 'Priset måste vara ett positivt tal' });
  }

  db.prepare(
    'UPDATE products SET name = ?, price = ?, sku = ?, description = ? WHERE id = ?'
  ).run(name, price, sku, description || null, req.params.id);

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE - Ta bort produkt
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Produkten hittades inte' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;