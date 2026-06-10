import db from './db.js';

const API = 'https://dummyjson.com';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

function seedCategories() {
  const categories = [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Fragrances', slug: 'fragrances' },
    { name: 'Skincare', slug: 'skincare' },
    { name: 'Groceries', slug: 'groceries' },
    { name: 'Home Decoration', slug: 'home-decoration' },
    { name: 'Furniture', slug: 'furniture' },
    { name: 'Tops', slug: 'tops' },
    { name: 'Womens Dresses', slug: 'womens-dresses' },
    { name: 'Womens Shoes', slug: 'womens-shoes' },
    { name: 'Mens Shirts', slug: 'mens-shirts' },
    { name: 'Mens Shoes', slug: 'mens-shoes' },
    { name: 'Mens Watches', slug: 'mens-watches' },
    { name: 'Womens Watches', slug: 'womens-watches' },
    { name: 'Womens Bags', slug: 'womens-bags' },
    { name: 'Womens Jewellery', slug: 'womens-jewellery' },
    { name: 'Sunglasses', slug: 'sunglasses' },
    { name: 'Automotive', slug: 'automotive' },
    { name: 'Motorcycle', slug: 'motorcycle' },
    { name: 'Lighting', slug: 'lighting' },
  ];

  const insert = db.prepare('INSERT OR IGNORE INTO categories (id, name, slug) VALUES (?, ?, ?)');
  const tx = db.transaction(() => {
    categories.forEach((c, i) => insert.run(i + 1, c.name, c.slug));
  });
  tx();
  console.log(`Seeded ${categories.length} categories`);
}

export async function seedData() {
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (count.count > 0) {
    console.log(`Database already has ${count.count} products, skipping seed`);
    return;
  }

  seedCategories();

  console.log('Fetching products from DummyJSON...');
  const { products } = await fetchJSON(`${API}/products?limit=0`);
  console.log(`Got ${products.length} products`);

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (id, title, description, price, discountPercentage, rating, stock, brand, category_id, thumbnail, images, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Map category string to category_id
  const catMap = {};
  const cats = db.prepare('SELECT id, slug FROM categories').all();
  for (const c of cats) catMap[c.slug] = c.id;
  // fallback: try matching by name
  for (const c of cats) catMap[c.slug.toLowerCase().replace(/\s+/g, '-')] = c.id;

  const tx = db.transaction(() => {
    for (const p of products) {
      const catSlug = (p.category || '').toLowerCase().replace(/\s+/g, '-');
      const categoryId = catMap[catSlug] || null;
      insertProduct.run(
        p.id, p.title, p.description || '', p.price, p.discountPercentage || 0,
        p.rating || 0, p.stock || 0, p.brand || '', categoryId,
        p.thumbnail || '', JSON.stringify(p.images || []), JSON.stringify(p.tags || [])
      );
    }
  });
  tx();

  console.log(`Seeded ${products.length} products`);
}
