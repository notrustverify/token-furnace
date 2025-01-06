import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function ConfirmBurnModal({ isOpen, onClose, onConfirm, amount, symbol, isMax }) {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative z-10 p-6 rounded-2xl shadow-xl max-w-md w-full m-4 ${
        isDark 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-semibold mb-4">
          {t('confirmBurnTitle')}
        </h2>
        
        <p className="mb-6">
          {isMax 
            ? `${t('confirmBurnAll')} ${symbol} ${t('tokens')}?`
            : `${t('confirmBurnMessage')} ${amount} ${symbol}?`
          }
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {t('cancel')}
          </button>
          
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
} 