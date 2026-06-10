export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">精选购</h3>
          <p className="text-sm">一站式品质购物平台</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">客户服务</h4>
          <ul className="text-sm space-y-1">
            <li>帮助中心</li>
            <li>退换货政策</li>
            <li>配送说明</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">公司信息</h4>
          <ul className="text-sm space-y-1">
            <li>关于我们</li>
            <li>加入我们</li>
            <li>联系我们</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">支付方式</h4>
          <ul className="text-sm space-y-1">
            <li>微信支付 / 支付宝</li>
            <li>银行卡支付</li>
            <li>货到付款</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; 2026 精选购. 演示项目. 保留所有权利.
      </div>
    </footer>
  );
}
