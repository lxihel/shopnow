import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items, fetchCart, count } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">精选购</Link>

        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={(e) => { e.preventDefault(); navigate(`/products?search=${e.target.q.value}`); }}>
            <input
              name="q"
              type="text"
              placeholder="搜索商品..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </form>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="text-sm text-gray-600 hover:text-indigo-600">我的订单</Link>
              <span className="text-sm text-gray-600">你好，{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500">退出</button>
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
