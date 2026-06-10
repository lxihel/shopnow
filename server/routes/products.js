import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { page = 1, limit = 20, category, sort, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let where = '';
  const params = [];

  if (category) {
    where += 'WHERE c.slug = ?';
    params.push(category);
  }
  if (search) {
    where += where ? ' AND ' : 'WHERE ';
    where += '(p.title LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  let orderBy = 'ORDER BY p.id DESC';
  if (sort === 'price_asc') orderBy = 'ORDER BY p.price ASC';
  if (sort === 'price_desc') orderBy = 'ORDER BY p.price DESC';
  if (sort === 'rating') orderBy = 'ORDER BY p.rating DESC';

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`).get(...params);
  const products = db.prepare(`SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where} ${orderBy} LIMIT ? OFFSET ?`).all(...params, Number(limit), offset);

  res.json({
    products: products.map(p => ({ ...p, images: JSON.parse(p.images), tags: JSON.parse(p.tags) })),
    total: countRow.total,
    page: Number(page),
    totalPages: Math.ceil(countRow.total / Number(limit))
  });
});

router.get('/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  res.json(categories);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.images = JSON.parse(product.images);
  product.tags = JSON.parse(product.tags);
  const reviews = db.prepare('SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC').all(product.id);
  res.json({ ...product, reviews });
});

export default router;
