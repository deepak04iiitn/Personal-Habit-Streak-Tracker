import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" 
}) => {

  if(!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
      default:
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
    }
  };

  const styles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if(e.target === e.currentTarget) 
    {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
        
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`cursor-pointer flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;