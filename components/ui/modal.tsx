'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './button';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  isLoading?: boolean;
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'confirm',
  cancelText = 'cancel',
  onConfirm,
  onCancel,
  showCancel = true,
  isLoading = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = 'unset';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const IconComponent = iconMap[type];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white border border-grey-300 rounded-lg shadow-lg animate-slide-in"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              type === 'error' ? 'bg-red-50' :
              type === 'warning' ? 'bg-yellow-50' :
              type === 'success' ? 'bg-green-50' :
              'bg-grey-50'
            }`}>
              <IconComponent className={`h-5 w-5 ${
                type === 'error' ? 'text-red-600' :
                type === 'warning' ? 'text-yellow-600' :
                type === 'success' ? 'text-green-600' :
                'text-grey-600'
              }`} />
            </div>
            <h2 id="modal-title" className="text-lg font-semibold text-black">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-grey-400 hover:text-grey-600 transition-colors"
            aria-label="close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="modal-message" className="text-grey-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-grey-200">
          {showCancel && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="hover-scale"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`hover-scale ${
              type === 'error' ? 'bg-red-600 hover:bg-red-700' :
              type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
              type === 'success' ? 'bg-green-600 hover:bg-green-700' :
              ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                loading...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Confirmation Modal Hook
export function useConfirmationModal() {
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showModal = (config: Omit<typeof modalState, 'isOpen'>) => {
    setModalState({
      ...config,
      isOpen: true,
    });
  };

  const hideModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const confirm = (config: {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      showModal({
        ...config,
        type: config.type || 'info',
        onConfirm: () => {
          hideModal();
          resolve(true);
        },
        onCancel: () => {
          hideModal();
          resolve(false);
        },
        showCancel: true,
      });
    });
  };

  const alert = (config: {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    confirmText?: string;
  }): Promise<void> => {
    return new Promise((resolve) => {
      showModal({
        ...config,
        type: config.type || 'info',
        onConfirm: () => {
          hideModal();
          resolve();
        },
        showCancel: false,
      });
    });
  };

  const ModalComponent = () => (
    <Modal
      isOpen={modalState.isOpen}
      onClose={hideModal}
      title={modalState.title}
      message={modalState.message}
      type={modalState.type}
      confirmText={modalState.confirmText}
      cancelText={modalState.cancelText}
      onConfirm={modalState.onConfirm}
      onCancel={modalState.onCancel}
      showCancel={modalState.showCancel}
      isLoading={modalState.isLoading}
    />
  );

  return {
    showModal,
    hideModal,
    confirm,
    alert,
    ModalComponent,
  };
}
