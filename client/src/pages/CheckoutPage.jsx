import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import { api } from '../api';

export function CheckoutPage() {
  const { user } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  const total = items.reduce((sum, i) => sum + i.price * (1 - (i.discountPercentage || 0) / 100) * i.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) { setError('请填写收货地址'); return; }
    setLoading(true);
    try {
      const result = await api.createOrder({
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        address,
        payment_method: payment,
      });
      await fetchCart();
      navigate(`/orders/${result.order_id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg">购物车还是空的</p>
        <Link to="/products" className="text-indigo-600 mt-2 inline-block">去逛逛 →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">结算</h1>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold mb-4">收货地址</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="请填写完整地址（省市区、街道、门牌号、联系电话）"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 h-28 resize-none"
              required
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow mt-4">
            <h2 className="font-bold mb-4">支付方式</h2>
            <div className="space-y-2">
              {[
                { value: 'cod', label: '货到付款', desc: '收到商品后再付款' },
                { value: 'card', label: '银行卡支付（模拟）', desc: '支持各大银行借记卡/信用卡' },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPayment(method.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${payment === method.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="font-medium text-sm">{method.label}</div>
                  <div className="text-xs text-gray-400">{method.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow sticky top-20">
            <h2 className="font-bold mb-4">订单摘要</h2>
            <div className="space-y-2 text-sm">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span className="truncate pr-2">{i.title} ×{i.quantity}</span>
                  <span>¥{(i.price * (1 - (i.discountPercentage || 0) / 100) * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>合计</span>
              <span className="text-red-500">¥{Math.round(total * 100) / 100}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '处理中...' : '提交订单'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
