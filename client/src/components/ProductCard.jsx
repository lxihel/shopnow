import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 truncate">{product.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-red-500">¥{discountedPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 line-through">¥{product.price}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-yellow-500">★ {product.rating}</span>
          <span className="text-xs text-gray-400">库存 {product.stock}</span>
        </div>
      </div>
    </Link>
  );
}
