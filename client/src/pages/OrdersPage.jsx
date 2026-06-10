import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { api } from '../api';

export function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getOrders().then(setOrders).finally(() => setLoading(false));
    }
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      {loading ? (
        <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">还没有订单</p>
          <Link to="/products" className="text-indigo-600 mt-2 inline-block">去逛逛 →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="bg-white rounded-xl p-4 shadow flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <span className="font-medium">订单 #{order.id}</span>
                <p className="text-sm text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString('zh-CN')}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-red-500">¥{order.total}</div>
                <span className={`text-xs inline-block px-2 py-1 rounded-full mt-1 ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.status === 'confirmed' ? '已确认' : order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getOrder(id).then(setOrder).finally(() => setLoading(false));
    }
  }, [id]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><div className="h-48 bg-gray-200 rounded-xl animate-pulse" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-400">订单未找到</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-indigo-600 text-sm hover:underline mb-4 inline-block">← 返回订单列表</Link>
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">订单 #{order.id}</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {order.status === 'confirmed' ? '已确认' : order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-gray-400">下单时间：</span> {new Date(order.created_at).toLocaleString('zh-CN')}</div>
          <div><span className="text-gray-400">支付方式：</span> {order.payment_method === 'cod' ? '货到付款' : '银行卡'}</div>
          <div className="col-span-2"><span className="text-gray-400">收货地址：</span> {order.address}</div>
        </div>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center border-b pb-3">
              <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1">
                <Link to={`/product/${item.product_id}`} className="text-sm font-medium hover:text-indigo-600">{item.title}</Link>
                <p className="text-xs text-gray-400">数量: {item.quantity} × ¥{item.price}</p>
              </div>
              <span className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
          <span>合计</span>
          <span className="text-red-500">¥{order.total}</span>
        </div>
      </div>
    </div>
  );
}
