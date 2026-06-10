import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ products: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (search) params.search = search;
    api.getProducts(params).then(setData).finally(() => setLoading(false));
  }, [page, category, sort, search]);

  const updateParams = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const catNames = {
    smartphones: '手机', laptops: '笔记本', fragrances: '香水', skincare: '护肤',
    groceries: '食品', 'home-decoration': '家居装饰', furniture: '家具', tops: '上衣',
    'womens-dresses': '连衣裙', 'mens-shirts': '男士衬衫',
  };

  const title = search ? `搜索："${search}"` : category ? (catNames[category] || category) : '全部商品';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => updateParams('sort', e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="">默认排序</option>
            <option value="price_asc">价格从低到高</option>
            <option value="price_desc">价格从高到低</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : data.products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">没有找到商品</p>
          <Link to="/products" className="text-indigo-600 mt-2 inline-block">清除筛选</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: data.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => updateParams('page', String(i + 1))}
                className={`px-4 py-2 rounded-lg text-sm ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
