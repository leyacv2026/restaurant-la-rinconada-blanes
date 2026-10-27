import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert, Check } from 'lucide-react';
import { authenticateCRM } from '../../utils/storage';

interface CRMAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CRMAuthModal: React.FC<CRMAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    if (pin.length < 5) {
      const next = pin + d;
      setPin(next);
      setError(false);
      if (next.length === 5) {
        verify(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verify = (codeToVerify: string) => {
    if (authenticateCRM(codeToVerify)) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify(pin);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#18130f] border border-[#3e3025] rounded-xl max-w-sm w-full p-6 text-[#fbf8f5] shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c7b73] hover:text-white transition-colors"
          aria-label="Cerrar acceso"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#291e16] border border-[#ea580c]/30 text-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Acceso Interno CRM
          </h3>
          <p className="text-xs text-[#a89993] mt-1">
            Panel exclusivo para la gestión de reservas y sala de La Rinconada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PIN dots display */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4].map((idx) => {
              const hasDigit = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-9 h-11 rounded-md border flex items-center justify-center font-mono text-lg font-bold transition-all ${
                    error
                      ? 'border-red-500 bg-red-950/30 text-red-400'
                      : hasDigit
                      ? 'border-[#ea580c] bg-[#ea580c]/10 text-white'
                      : 'border-[#33261b] bg-[#120e0b] text-[#6e5d54]'
                  }`}
                >
                  {hasDigit ? '●' : ''}
                </div>
              );
            })}
          </div>

          {error && (
            <p className="text-center text-xs text-red-400 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>PIN incorrecto. Inténtalo de nuevo.</span>
            </p>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="py-3 bg-[#201812] hover:bg-[#2b2018] active:bg-[#ea580c] active:text-white border border-[#33261b] rounded-md font-mono text-base font-semibold text-white transition-colors"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPin('17300');
                verify('17300');
              }}
              className="py-3 bg-[#15100c] hover:bg-[#221812] border border-[#2b2017] rounded-md text-[11px] text-[#ea580c] font-medium"
              title="Autocompletar PIN por defecto (17300)"
            >
              PIN Blanes
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="py-3 bg-[#201812] hover:bg-[#2b2018] active:bg-[#ea580c] active:text-white border border-[#33261b] rounded-md font-mono text-base font-semibold text-white transition-colors"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 bg-[#201812] hover:bg-[#2b2018] border border-[#33261b] rounded-md text-xs font-medium text-[#bcaaa4] transition-colors"
            >
              Borrar
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => {
                setPin('17300');
                verify('17300');
              }}
              className="w-full py-2.5 px-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Acceso Rápido con PIN 17300</span>
            </button>
            <p className="text-center text-[11px] text-[#786962]">
              PIN por defecto: <strong className="text-[#a89993]">17300</strong> o <strong className="text-[#a89993]">1850</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
