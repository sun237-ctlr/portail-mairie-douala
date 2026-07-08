import { useLangue } from '../context/LangueContext';
import { Languages } from 'lucide-react';

export default function BoutonLangue() {
  const { langue, changerLangue } = useLangue();

  return (
    <button
      onClick={changerLangue}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-green-400 hover:text-green-700 transition"
      title={langue === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <Languages size={15} />
      <span>{langue === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  );
}
