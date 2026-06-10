import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

function useProductQuery(params = {}) {
  const [data, setData] = useState({ products: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts(params).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { ...data, loading };
}

const categories = [
  { slug: 'smartphones', name: '手机' },
  { slug: 'laptops', name: '笔记本' },
  { slug: 'fragrances', name: '香水' },
  { slug: 'skincare', name: '护肤' },
  { slug: 'groceries', name: '食品' },
  { slug: 'home-decoration', name: '家居装饰' },
  { slug: 'furniture', name: '家具' },
  { slug: 'tops', name: '上衣' },
  { slug: 'womens-dresses', name: '连衣裙' },
  { slug: 'mens-shirts', name: '男士衬衫' },
];

export function HomePage() {
  const [search, setSearch] = useState('');
  const { products, loading } = useProductQuery({ limit: 12, sort: 'rating' });

  return (
    <div>
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">发现品质好物</h1>
          <p className="text-xl text-indigo-100 mb-8">精选全球好货，尽享超值优惠</p>
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/products?search=${encodeURIComponent(search)}`; }} className="max-w-md mx-auto flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="你想找什么？" className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none" />
            <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-300">搜索</button>
          </form>
        </div>
      </section>

      {/* 分类 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">按分类选购</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c.slug} to={`/products?category=${c.slug}`} className="px-4 py-2 bg-white rounded-full shadow text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 热门商品 */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">高分好评</h2>
          <Link to="/products" className="text-indigo-600 text-sm hover:underline">查看全部 →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
