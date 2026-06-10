import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.getProduct(id).then((p) => {
      setProduct(p);
      setMainImg(p.thumbnail);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse"><div className="h-96 bg-gray-200 rounded-xl" /></div>;
  if (!product) return <div className="text-center py-20 text-gray-400">商品未找到</div>;

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-indigo-600">首页</Link> /
        <Link to="/products" className="hover:text-indigo-600 ml-1">商品</Link> /
        <span className="ml-1 text-gray-600">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 图片 */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img src={mainImg} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {[product.thumbnail, ...product.images.slice(0, 5)].map((img, i) => (
              <button key={i} onClick={() => setMainImg(img)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${mainImg === img ? 'border-indigo-600' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 商品信息 */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-500 mt-1">{product.brand && `${product.brand} · `}{product.category_name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500">★ {product.rating}</span>
            <span className="text-gray-400 text-sm">| 库存 {product.stock} 件</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-red-500">¥{discountedPrice}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">¥{product.price}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">-{product.discountPercentage}%</span>
              </>
            )}
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
              <span className="px-4 py-2 border-x">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
            <button
              onClick={handleAdd}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${added ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {added ? '✓ 已加入购物车' : '加入购物车'}
            </button>
          </div>

          {product.tags?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {product.tags.map((t) => (
                <Link key={t} to={`/products?search=${encodeURIComponent(t)}`} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 hover:bg-indigo-50 hover:text-indigo-600">
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 评价 */}
      {product.reviews?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">用户评价</h2>
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.user_name || '匿名用户'}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="text-gray-600 mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
