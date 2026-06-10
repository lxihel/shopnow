import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.post('/', (req, res) => {
  const { items, address, payment_method } = req.body;
  if (!items?.length || !address) {
    return res.status(400).json({ error: 'Items and address required' });
  }

  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (!product) return res.status(404).json({ error: `Product ${item.product_id} not found` });
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for ${product.title}` });
    }
    const price = product.price * (1 - product.discountPercentage / 100);
    total += price * item.quantity;
    orderItems.push({ product_id: product.id, quantity: item.quantity, price });
  }

  const order = db.prepare('INSERT INTO orders (user_id, status, total, address, payment_method) VALUES (?, ?, ?, ?, ?)').run(
    req.user.id, 'confirmed', Math.round(total * 100) / 100, address, payment_method || 'cod'
  );

  const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
  for (const oi of orderItems) {
    insertItem.run(order.lastInsertRowid, oi.product_id, oi.quantity, oi.price);
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(oi.quantity, oi.product_id);
  }

  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

  res.json({ success: true, order_id: order.lastInsertRowid, total: Math.round(total * 100) / 100 });
});

router.get('/', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.prepare(`
    SELECT oi.*, p.title, p.thumbnail FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).all(order.id);
  res.json({ ...order, items });
});

export default router;
