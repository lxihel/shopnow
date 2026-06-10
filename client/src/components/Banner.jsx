import { useState } from 'react';

export default function Banner({ children }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm">
      {children}
      <button onClick={() => setVisible(false)} className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
    </div>
  );
}
