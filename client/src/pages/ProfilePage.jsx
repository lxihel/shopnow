import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export function ProfilePage() {
  const { user, logout } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>
      <div className="bg-white rounded-xl p-6 shadow space-y-4">
        <div>
          <label className="text-sm text-gray-400">昵称</label>
          <p className="text-lg font-medium">{user.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">邮箱</label>
          <p className="text-lg">{user.email}</p>
        </div>
        <button onClick={logout} className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors">
          退出登录
        </button>
      </div>
    </div>
  );
}
