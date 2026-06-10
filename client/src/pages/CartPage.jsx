import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';

export function CartPage() {
  const { user } = useAuthStore();
  const { items, loading, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCart();
  }, []);

  if (!user) return null;

  const total = items.reduce((sum, i) => sum + i.price * (1 - (i.discountPercentage || 0) / 100) * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">购物车</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">购物车还是空的</p>
          <Link to="/products" className="text-indigo-600 mt-2 inline-block hover:underline">去逛逛 →</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow flex gap-4 items-center">
                <Link to={`/product/${item.product_id}`}>
                  <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`} className="font-medium text-sm hover:text-indigo-600 truncate block">{item.title}</Link>
                  <p className="text-red-500 font-bold">¥{(item.price * (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}</p>
                </div>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => updateItem(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100 text-sm">-</button>
                  <span className="px-3 py-1 border-x text-sm">{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100 text-sm">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow mt-6">
            <div className="flex justify-between text-lg font-bold">
              <span>合计</span>
              <span className="text-red-500">¥{Math.round(total * 100) / 100}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              去结算
            </button>
          </div>
        </>
      )}
    </div>
  );
}
