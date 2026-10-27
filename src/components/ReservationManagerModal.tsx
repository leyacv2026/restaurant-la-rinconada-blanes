import React, { useState } from 'react';
import { X, Search, Calendar, Users, Phone, MapPin, MessageSquare, CalendarPlus, Ban, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { buildWhatsAppMessage, downloadCalendarEvent } from '../utils/storage';

interface ReservationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onNewBookingClick: () => void;
}

export const ReservationManagerModal: React.FC<ReservationManagerModalProps> = ({
  isOpen,
  onClose,
  reservations,
  onCancelReservation,
  onNewBookingClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = reservations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#18130f] border border-[#382b20] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#fbf8f5]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2d2218] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-display text-white">
              Gestor de Reservas · La Rinconada
            </h3>
            <p className="text-xs text-[#a89993] mt-0.5">
              Consulta, confirma por WhatsApp o cancela tus mesas registradas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#a89993] hover:text-white rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-[#2d2218] bg-[#140f0c] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8d7b73] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código (ej. RIN-4912) o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1611] border border-[#33261b] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ea580c]"
            />
          </div>
          <button
            onClick={() => {
              onClose();
              onNewBookingClick();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-md transition-colors whitespace-nowrap"
          >
            + Nueva Reserva
          </button>
        </div>

        {/* Reservation List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8c7b73]">
              <Calendar className="w-8 h-8 mx-auto text-[#4d3c30] mb-2" />
              <p className="text-sm">No se encontraron reservas con ese criterio.</p>
            </div>
          ) : (
            filtered.map((res) => {
              const isCancelled = res.status === 'cancelada';
              return (
                <div
                  key={res.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    isCancelled
                      ? 'bg-[#15110e] border-[#291e17] opacity-60'
                      : 'bg-[#1f1914] border-[#382b20]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#ea580c] bg-[#ea580c]/10 px-2 py-0.5 rounded border border-[#ea580c]/20">
                          #{res.code}
                        </span>
                        <span className="font-bold text-white text-base font-display">
                          {res.customerName}
                        </span>
                      </div>
                      <div className="text-xs text-[#a89993] mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{res.phone}</span>
                        </span>
                        {res.email && <span>{res.email}</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                          isCancelled
                            ? 'bg-red-950/60 text-red-300 border border-red-800/40'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        }`}
                      >
                        {isCancelled ? 'Cancelada' : 'Confirmada'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#15100c] p-2.5 rounded border border-[#2b2016] text-[#c5b8b0] mb-3">
                    <div>
                      <span className="text-[#8c7b73] block">Fecha</span>
                      <strong className="text-white">{res.date}</strong>
                    </div>
                    <div>
                      <span className="text-[#8c7b73] block">Hora</span>
                      <strong className="text-white">{res.time} h</strong>
                    </div>
                    <div>
                      <span className="text-[#8c7b73] block">Comensales</span>
                      <strong className="text-white">{res.guests} personas</strong>
                    </div>
                    <div>
                      <span className="text-[#8c7b73] block">Mesa Asignada</span>
                      <strong className="text-white">
                        {res.tableNumber ? `${res.tableNumber} (Salón)` : 'Salón Rústico'}
                      </strong>
                    </div>
                  </div>

                  {res.specialRequests && (
                    <p className="text-xs text-[#bcaaa4] italic mb-3">
                      "{res.specialRequests}"
                    </p>
                  )}

                  {/* Actions */}
                  {!isCancelled && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2d2218]">
                      <div className="flex items-center gap-2">
                        <a
                          href={buildWhatsAppMessage(res)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/80 rounded border border-emerald-800/40 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => downloadCalendarEvent(res)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#d6ccc2] bg-[#291e17] hover:bg-[#382b21] rounded border border-[#3e3025] transition-colors"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>.ICS</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Seguro que deseas cancelar la reserva #${res.code}?`)) {
                            onCancelReservation(res.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancelar mesa</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#2d2218] bg-[#140f0c] text-xs text-[#8c7b73] flex items-center justify-between">
          <span>Total reservas registradas: {reservations.length}</span>
          <span>Restaurante Asador La Rinconada</span>
        </div>
      </div>
    </div>
  );
};
