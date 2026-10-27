import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  XCircle,
  LogOut,
  Flame,
  Star,
  ChevronRight,
  Edit2,
  Save,
  Trash2,
  Coffee,
  Check,
  UserCheck,
  Shield,
  Layers,
  LayoutGrid,
  List,
  UtensilsCrossed,
  X,
  Armchair,
} from 'lucide-react';
import { Reservation, ReservationShift, ReservationStatus, TableZone, CustomerProfile } from '../../types';
import { RESTAURANT_INFO } from '../../data/restaurantData';
import { RESTAURANT_TABLES, RestaurantTable } from '../../data/tables';
import {
  saveReservation,
  updateReservation,
  deleteReservation,
  exportReservationsToCSV,
  buildWhatsAppMessage,
  logoutCRM,
} from '../../utils/storage';

interface ReservationCRMProps {
  reservations: Reservation[];
  onReservationsChange: (updated: Reservation[]) => void;
  onExitCRM: () => void;
}

export const ReservationCRM: React.FC<ReservationCRMProps> = ({
  reservations,
  onReservationsChange,
  onExitCRM,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedShift, setSelectedShift] = useState<'all' | ReservationShift>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ReservationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'servicio' | 'plano' | 'clientes'>('servicio');

  // Interactive Seating Modal States
  const [seatingTargetRes, setSeatingTargetRes] = useState<Reservation | null>(null);
  const [quickSeatTableTarget, setQuickSeatTableTarget] = useState<RestaurantTable | null>(null);

  // Modals & In-line editing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // New reservation form state (for phone/walk-in)
  const [newResName, setNewResName] = useState('');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResDate, setNewResDate] = useState(todayStr);
  const [newResTime, setNewResTime] = useState('14:00');
  const [newResShift, setNewResShift] = useState<ReservationShift>('mediodia');
  const [newResGuests, setNewResGuests] = useState(2);
  const [newResZone, setNewResZone] = useState<TableZone>('salon');
  const [newResTable, setNewResTable] = useState('Mesa 3');
  const [newResRequests, setNewResRequests] = useState('');
  const [newResStaffNotes, setNewResStaffNotes] = useState('');
  const [newResIsVIP, setNewResIsVIP] = useState(false);

  // Filtered reservations for the selected date
  const dayReservations = useMemo(() => {
    return reservations.filter((r) => r.date === selectedDate);
  }, [reservations, selectedDate]);

  // Map of currently occupied / assigned tables for the selected date & shift
  const occupiedTablesMap = useMemo(() => {
    const map = new Map<string, Reservation>();
    dayReservations.forEach((r) => {
      if (r.status !== 'cancelada' && r.status !== 'no_show' && r.tableNumber) {
        // If shift filter is active, check shift
        if (selectedShift === 'all' || r.shift === selectedShift) {
          map.set(r.tableNumber, r);
        }
      }
    });
    return map;
  }, [dayReservations, selectedShift]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (selectedDate && r.date !== selectedDate) return false;
      if (selectedShift !== 'all' && r.shift !== selectedShift) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.customerName.toLowerCase().includes(q);
        const matchesCode = r.code.toLowerCase().includes(q);
        const matchesPhone = r.phone.includes(q);
        const matchesTable = (r.tableNumber || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesPhone && !matchesTable) return false;
      }
      return true;
    });
  }, [reservations, selectedDate, selectedShift, selectedStatus, searchQuery]);

  // Daily KPIs
  const kpis = useMemo(() => {
    const active = dayReservations.filter((r) => r.status !== 'cancelada' && r.status !== 'no_show');
    const totalDiners = active.reduce((acc, r) => acc + r.guests, 0);
    const seatedCount = active.filter((r) => r.status === 'sentada').length;
    const confirmedCount = active.filter((r) => r.status === 'confirmada').length;
    const completedCount = active.filter((r) => r.status === 'completada').length;
    const lunchDiners = active.filter((r) => r.shift === 'mediodia').reduce((acc, r) => acc + r.guests, 0);
    const dinnerDiners = active.filter((r) => r.shift === 'noche').reduce((acc, r) => acc + r.guests, 0);
    const estimatedRev = totalDiners * RESTAURANT_INFO.menuPizarraPrice;

    return {
      totalDiners,
      totalTables: active.length,
      seatedCount,
      confirmedCount,
      completedCount,
      lunchDiners,
      dinnerDiners,
      estimatedRev,
    };
  }, [dayReservations]);

  // Synthesized Customer Directory
  const customers = useMemo(() => {
    const map = new Map<string, CustomerProfile>();
    reservations.forEach((r) => {
      const key = r.phone || r.customerName;
      const existing = map.get(key);
      if (existing) {
        existing.totalVisits += 1;
        existing.totalGuests += r.guests;
        if (r.date > existing.lastVisit) existing.lastVisit = r.date;
        if (r.isVIP) existing.isVIP = true;
      } else {
        map.set(key, {
          phone: r.phone,
          name: r.customerName,
          email: r.email,
          totalVisits: 1,
          totalGuests: r.guests,
          lastVisit: r.date,
          favoriteZone: r.zone,
          isVIP: !!r.isVIP,
          internalNotes: r.staffNotes,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalVisits - a.totalVisits);
  }, [reservations]);

  // Actions
  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    const updated = updateReservation(id, { status: newStatus });
    onReservationsChange(updated);
  };

  const handleTableAssignAndSeat = (reservationId: string, tableNumber: string) => {
    const updated = updateReservation(reservationId, {
      tableNumber,
      status: 'sentada',
    });
    onReservationsChange(updated);
    setSeatingTargetRes(null);
    setQuickSeatTableTarget(null);
  };

  const handleTableAssignOnly = (id: string, tableNumber: string) => {
    const updated = updateReservation(id, { tableNumber });
    onReservationsChange(updated);
  };

  const handleToggleVIP = (id: string, currentVIP?: boolean) => {
    const updated = updateReservation(id, { isVIP: !currentVIP });
    onReservationsChange(updated);
  };

  const handleSaveStaffNotes = (id: string) => {
    const updated = updateReservation(id, { staffNotes: tempNotes });
    onReservationsChange(updated);
    setEditingNotesId(null);
  };

  const handleDeleteRes = (id: string, code: string) => {
    if (confirm(`¿Eliminar definitivamente la reserva #${code}?`)) {
      const updated = deleteReservation(id);
      onReservationsChange(updated);
    }
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const created = saveReservation({
      customerName: newResName.trim(),
      phone: newResPhone.trim() || '-',
      email: '',
      date: newResDate,
      time: newResTime,
      shift: newResShift,
      guests: Number(newResGuests),
      zone: newResZone,
      tableNumber: newResTable || undefined,
      specialRequests: newResRequests.trim() || undefined,
      staffNotes: newResStaffNotes.trim() || 'Registrado por teléfono / en sala.',
      isVIP: newResIsVIP,
      status: 'confirmada',
    });

    onReservationsChange([created, ...reservations]);
    setIsAddModalOpen(false);
    // Reset form
    setNewResName('');
    setNewResPhone('');
    setNewResRequests('');
    setNewResStaffNotes('');
  };

  const handlePrintService = () => {
    window.print();
  };

  // Pending reservations that can be seated at a table right now
  const pendingReservationsForDay = useMemo(() => {
    return dayReservations.filter((r) => r.status === 'confirmada');
  }, [dayReservations]);

  return (
    <div className="min-h-screen bg-[#110d0a] text-[#fbf8f5] flex flex-col font-sans selection:bg-[#ea580c] selection:text-white">
      {/* Top CRM App Bar */}
      <header className="sticky top-0 z-40 bg-[#16120e] border-b border-[#2d241c] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#ea580c] text-white flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-display text-base">
                  LA RINCONADA
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#281c14] text-[#f97316] border border-[#ea580c]/30 px-1.5 py-0.5 rounded">
                  SALA CRM & MAÎTRE
                </span>
              </div>
              <p className="text-[11px] text-[#8c7b73]">
                Gestor Profesional de Mesas & Reservas · Blanes
              </p>
            </div>
          </div>

          {/* CRM Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#1d1611] p-1 rounded-lg border border-[#2f2217]">
            <button
              onClick={() => setActiveTab('servicio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'servicio'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-[#a89993] hover:text-white'
              }`}
            >
              Hoja de Sala
            </button>
            <button
              onClick={() => setActiveTab('plano')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'plano'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-[#a89993] hover:text-white'
              }`}
            >
              Mesas & Distribución ({occupiedTablesMap.size} ocupadas)
            </button>
            <button
              onClick={() => setActiveTab('clientes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'clientes'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-[#a89993] hover:text-white'
              }`}
            >
              Clientes Frecuentes ({customers.length})
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-md transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Reserva</span>
            </button>

            <button
              onClick={() => exportReservationsToCSV(dayReservations)}
              title="Exportar hoja de reservas a Excel/CSV"
              className="p-2 text-[#a89993] hover:text-white bg-[#1f1712] hover:bg-[#2b2019] border border-[#33261c] rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrintService}
              title="Imprimir hoja de sala del día"
              className="p-2 text-[#a89993] hover:text-white bg-[#1f1712] hover:bg-[#2b2019] border border-[#33261c] rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-6 bg-[#33261b] mx-1" />

            <button
              onClick={() => {
                logoutCRM();
                onExitCRM();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#c5b8b0] hover:text-white bg-[#221711] hover:bg-[#2e2017] border border-[#38281d] rounded-md transition-colors"
              title="Cerrar CRM y volver a la web pública"
            >
              <LogOut className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Cerrar CRM</span>
            </button>
          </div>
        </div>
      </header>

      {/* Date & Shift Filter Bar */}
      <div className="bg-[#18130f] border-b border-[#2d241c] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Quick Date buttons */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#120e0b] border border-[#33261b] text-white text-xs px-2.5 py-1.5 rounded-md focus:outline-none focus:border-[#ea580c]"
            />
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                selectedDate === todayStr
                  ? 'bg-[#ea580c]/20 text-[#ea580c] font-bold border border-[#ea580c]/40'
                  : 'bg-[#120e0b] text-[#a89993] hover:text-white border border-[#2d2218]'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => {
                const tom = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                setSelectedDate(tom);
              }}
              className="px-2.5 py-1.5 text-xs bg-[#120e0b] text-[#a89993] hover:text-white border border-[#2d2218] rounded-md transition-colors"
            >
              Mañana
            </button>
          </div>

          {/* Shifts selector */}
          <div className="flex items-center gap-1 bg-[#120e0b] p-1 rounded-md border border-[#2d2218] text-xs">
            <button
              onClick={() => setSelectedShift('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedShift === 'all'
                  ? 'bg-[#291e17] text-white font-semibold'
                  : 'text-[#8c7b73] hover:text-white'
              }`}
            >
              Todo el día
            </button>
            <button
              onClick={() => setSelectedShift('mediodia')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedShift === 'mediodia'
                  ? 'bg-[#291e17] text-[#ea580c] font-semibold'
                  : 'text-[#8c7b73] hover:text-white'
              }`}
            >
              Mediodía ({kpis.lunchDiners} com.)
            </button>
            <button
              onClick={() => setSelectedShift('noche')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedShift === 'noche'
                  ? 'bg-[#291e17] text-[#ea580c] font-semibold'
                  : 'text-[#8c7b73] hover:text-white'
              }`}
            >
              Noche ({kpis.dinnerDiners} com.)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#8c7b73] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, mesa o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#120e0b] border border-[#33261b] rounded-md pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#ea580c]"
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon for the day */}
      <div className="bg-[#140f0c] border-b border-[#2d241c] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-[#1a1410] border border-[#2f2218] p-3 rounded-lg">
            <div className="flex items-center justify-between text-xs text-[#8c7b73]">
              <span>Comensales del Día</span>
              <Users className="w-3.5 h-3.5 text-[#ea580c]" />
            </div>
            <p className="text-2xl font-bold text-white font-display mt-1 tabular-nums">
              {kpis.totalDiners}{' '}
              <span className="text-xs font-normal text-[#a89993]">pax</span>
            </p>
            <p className="text-[10px] text-[#8c7b73] mt-0.5">
              Almuerzo: {kpis.lunchDiners} · Cena: {kpis.dinnerDiners}
            </p>
          </div>

          <div className="bg-[#1a1410] border border-[#2f2218] p-3 rounded-lg">
            <div className="flex items-center justify-between text-xs text-[#8c7b73]">
              <span>Mesas con Reserva</span>
              <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
            </div>
            <p className="text-2xl font-bold text-white font-display mt-1 tabular-nums">
              {kpis.totalTables}{' '}
              <span className="text-xs font-normal text-[#a89993]">mesas</span>
            </p>
            <p className="text-[10px] text-[#8c7b73] mt-0.5">
              {kpis.confirmedCount} por sentar · {kpis.seatedCount} en mesa
            </p>
          </div>

          <div className="bg-[#1a1410] border border-[#2f2218] p-3 rounded-lg">
            <div className="flex items-center justify-between text-xs text-[#8c7b73]">
              <span>En Sala / Sentadas</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 font-display mt-1 tabular-nums">
              {kpis.seatedCount}
            </p>
            <p className="text-[10px] text-[#8c7b73] mt-0.5">
              {kpis.completedCount} servicios finalizados
            </p>
          </div>

          <div className="bg-[#1a1410] border border-[#2f2218] p-3 rounded-lg">
            <div className="flex items-center justify-between text-xs text-[#8c7b73]">
              <span>Estimación Menús</span>
              <Coffee className="w-3.5 h-3.5 text-[#ea580c]" />
            </div>
            <p className="text-2xl font-bold text-[#f97316] font-display mt-1 tabular-nums">
              {kpis.estimatedRev.toFixed(0)} €
            </p>
            <p className="text-[10px] text-[#8c7b73] mt-0.5">
              Base p.p. 18,50 €
            </p>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-[#1a1410] border border-[#2f2218] p-3 rounded-lg flex flex-col justify-between">
            <div className="text-xs text-[#8c7b73]">Filtro de Estado:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {(['all', 'confirmada', 'sentada', 'completada', 'no_show', 'cancelada'] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`text-[10px] px-2 py-0.5 rounded capitalize ${
                      selectedStatus === st
                        ? 'bg-[#ea580c] text-white font-bold'
                        : 'bg-[#221812] text-[#8c7b73] hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'Todos' : st}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'servicio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8c7b73]">
              <span>
                Mostrando {filteredReservations.length} reservas para el{' '}
                <strong className="text-white">{selectedDate}</strong>
              </span>
              <span>Ord.: Por hora de llegada</span>
            </div>

            {filteredReservations.length === 0 ? (
              <div className="bg-[#18130f] border border-[#2f2218] rounded-xl p-12 text-center text-[#8c7b73]">
                <Calendar className="w-10 h-10 mx-auto text-[#3d2d21] mb-3" />
                <h4 className="text-base font-bold text-white font-display">
                  No hay reservas registradas para esta fecha y filtros
                </h4>
                <p className="text-xs mt-1 max-w-md mx-auto">
                  Puedes registrar una reserva de última hora por teléfono o seleccionar otra fecha arriba.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-md transition-colors"
                >
                  + Registrar Reserva Manual
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredReservations.map((res) => {
                  const isSeated = res.status === 'sentada';
                  const isCompleted = res.status === 'completada';
                  const isCancelled = res.status === 'cancelada';
                  const isNoShow = res.status === 'no_show';

                  return (
                    <div
                      key={res.id}
                      className={`border rounded-xl p-4 sm:p-5 transition-all ${
                        isSeated
                          ? 'bg-[#18231a] border-emerald-700/70 shadow-lg'
                          : isCompleted
                          ? 'bg-[#141210] border-[#29221b] opacity-65'
                          : isCancelled || isNoShow
                          ? 'bg-[#150f0f] border-red-950/40 opacity-50'
                          : 'bg-[#1c1611] border-[#382b20] hover:border-[#4f3c2d]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* 1. Time, Guests, Customer Info */}
                        <div className="flex flex-wrap items-start gap-3 sm:gap-4 flex-1">
                          {/* Time & Shift */}
                          <div className="bg-[#120e0b] border border-[#302319] p-2.5 rounded-lg text-center min-w-[75px]">
                            <span className="text-base font-bold text-white font-mono tabular-nums block">
                              {res.time}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-[#f97316]">
                              {res.shift === 'mediodia' ? 'Almuerzo' : 'Cena'}
                            </span>
                          </div>

                          {/* Diners Count */}
                          <div className="bg-[#120e0b] border border-[#302319] p-2.5 rounded-lg text-center min-w-[60px]">
                            <span className="text-base font-bold text-white font-mono tabular-nums block">
                              {res.guests}
                            </span>
                            <span className="text-[10px] text-[#8c7b73] block">pax</span>
                          </div>

                          {/* Customer Name, Phone, VIP */}
                          <div className="space-y-1.5 flex-1 min-w-[220px]">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-base font-display">
                                {res.customerName}
                              </span>
                              {res.isVIP && (
                                <span className="bg-amber-950/60 text-amber-300 border border-amber-700/40 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span>VIP</span>
                                </span>
                              )}
                              <span className="text-xs font-mono text-[#ea580c] bg-[#291b12] px-1.5 py-0.5 rounded border border-[#ea580c]/20">
                                #{res.code}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-[#bcaaa4] flex-wrap">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#ea580c]" />
                                <a href={`tel:${res.phone}`} className="hover:underline font-mono">
                                  {res.phone}
                                </a>
                              </span>

                              <span className="text-[#8c7b73]">·</span>
                              <span className="text-[#a89993]">
                                Comedor: <strong className="text-white">Salón Rústico Interior</strong>
                              </span>
                            </div>

                            {/* Special request note */}
                            {res.specialRequests && (
                              <p className="text-xs text-[#f6d365] bg-[#2a2213] border border-[#443720] px-2.5 py-1 rounded">
                                <strong>Petición cliente:</strong> {res.specialRequests}
                              </p>
                            )}

                            {/* Staff Internal Note */}
                            {editingNotesId === res.id ? (
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="text"
                                  value={tempNotes}
                                  onChange={(e) => setTempNotes(e.target.value)}
                                  placeholder="Nota interna de sala..."
                                  className="text-xs bg-[#120e0b] border border-[#ea580c] rounded px-2.5 py-1 text-white flex-1"
                                />
                                <button
                                  onClick={() => handleSaveStaffNotes(res.id)}
                                  className="p-1 bg-[#ea580c] text-white rounded text-xs"
                                  title="Guardar nota"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  className="text-xs text-[#8c7b73] hover:text-white"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-[#8c7b73]">
                                <span className="italic">
                                  {res.staffNotes
                                    ? `Nota sala: "${res.staffNotes}"`
                                    : 'Sin notas internas'}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingNotesId(res.id);
                                    setTempNotes(res.staffNotes || '');
                                  }}
                                  className="text-[#ea580c] hover:underline flex items-center gap-1 text-[11px]"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>{res.staffNotes ? 'Editar' : '+ Nota'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. TABLE ASSIGNMENT & SEATING CONTROLS (SOLVES USER ISSUE) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#140f0c] p-3 rounded-lg border border-[#2d2218]">
                          {/* Table Badge and Picker */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-[#8c7b73] block uppercase tracking-wider">
                              Mesa Asignada:
                            </span>

                            {res.tableNumber ? (
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#251811] border border-[#ea580c]/50 rounded-md text-xs font-bold text-white shadow-sm">
                                  <Armchair className="w-3.5 h-3.5 text-[#f97316]" />
                                  <span>{res.tableNumber}</span>
                                </div>
                                <button
                                  onClick={() => setSeatingTargetRes(res)}
                                  className="text-[11px] text-[#ea580c] hover:underline font-medium"
                                  title="Cambiar mesa asignada"
                                >
                                  Cambiar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSeatingTargetRes(res)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-950/70 border border-amber-600/60 text-amber-300 hover:bg-amber-900/70 rounded-md text-xs font-semibold transition-colors"
                              >
                                <Armchair className="w-3.5 h-3.5" />
                                <span>+ Asignar Mesa</span>
                              </button>
                            )}
                          </div>

                          {/* Seating / Status Action Button */}
                          <div className="flex items-center gap-2">
                            {res.status === 'confirmada' ? (
                              <button
                                onClick={() => {
                                  if (res.tableNumber) {
                                    handleStatusChange(res.id, 'sentada');
                                  } else {
                                    setSeatingTargetRes(res);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow-md transition-all"
                                title="Sentar a los comensales en su mesa"
                              >
                                <UserCheck className="w-4 h-4" />
                                <span>Sentar en Mesa</span>
                              </button>
                            ) : isSeated ? (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 rounded text-xs font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>En Sala</span>
                                </span>

                                <button
                                  onClick={() => handleStatusChange(res.id, 'completada')}
                                  className="px-2.5 py-1.5 bg-[#251e18] hover:bg-[#342a22] text-[#c5b8b0] hover:text-white rounded text-xs border border-[#3e3025] transition-colors"
                                  title="Finalizar comida y liberar mesa"
                                >
                                  Liberar Mesa
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`text-xs px-2.5 py-1 rounded font-medium capitalize ${
                                  isCompleted
                                    ? 'bg-blue-950/50 text-blue-300 border border-blue-800/40'
                                    : 'bg-red-950/50 text-red-300 border border-red-800/40'
                                }`}
                              >
                                {res.status}
                              </span>
                            )}

                            {/* Dropdown for other status changes */}
                            <select
                              value={res.status}
                              onChange={(e) =>
                                handleStatusChange(res.id, e.target.value as ReservationStatus)
                              }
                              className="text-xs bg-[#1a1410] border border-[#33261b] rounded px-2 py-1.5 text-[#bcaaa4] focus:outline-none"
                            >
                              <option value="confirmada">Confirmada</option>
                              <option value="sentada">Sentada</option>
                              <option value="completada">Completada</option>
                              <option value="no_show">No Show</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                          </div>

                          {/* Communication shortcuts */}
                          <div className="flex items-center gap-1 border-l border-[#2d2218] pl-2">
                            <a
                              href={buildWhatsAppMessage(res)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/90 rounded border border-emerald-800/40 transition-colors"
                              title="Avisar o confirmar por WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleToggleVIP(res.id, res.isVIP)}
                              className={`p-2 rounded border transition-colors ${
                                res.isVIP
                                  ? 'text-amber-400 bg-amber-950/50 border-amber-700/50'
                                  : 'text-[#6e5d54] hover:text-amber-400 border-[#2f2217]'
                              }`}
                              title={res.isVIP ? 'Quitar VIP' : 'Marcar VIP'}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteRes(res.id, res.code)}
                              className="p-2 text-[#6e5d54] hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                              title="Eliminar reserva"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Table layout visualizer (Interactive Floor Plan) */}
        {activeTab === 'plano' && (
          <div className="space-y-6">
            <div className="bg-[#18130f] border border-[#2f2218] rounded-xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Distribución de Mesas · {selectedDate} ({selectedShift === 'all' ? 'Día Completo' : selectedShift})
                  </h3>
                  <p className="text-xs text-[#8c7b73] mt-0.5">
                    Haz clic en cualquier mesa libre para sentar a una reserva, o en una ocupada para liberarla.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#201711] border border-[#3e3025]" />
                    <span className="text-[#a89993]">Libre (Click para sentar)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
                    <span className="text-white font-semibold">En Sala / Ocupada</span>
                  </span>
                </div>
              </div>

              {/* Salón Interior Section (All 12 Tables) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                    Salón Comedor Rústico (12 Mesas Climatizadas)
                  </span>
                  <span className="text-xs text-[#8c7b73]">· Capacidad total: ~64 comensales</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {RESTAURANT_TABLES.map((table) => {
                    const assignedRes = occupiedTablesMap.get(table.name);
                    const isSeated = assignedRes?.status === 'sentada';

                    return (
                      <div
                        key={table.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between min-h-[125px] transition-all shadow-sm ${
                          assignedRes
                            ? isSeated
                              ? 'bg-[#152418] border-emerald-600/70'
                              : 'bg-[#2a1a12] border-[#ea580c]/70'
                            : 'bg-[#15100c] border-[#291e16] hover:border-[#423122]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                            <Armchair className="w-4 h-4 text-[#ea580c]" />
                            <span>{table.name}</span>
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                              assignedRes
                                ? isSeated
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#ea580c] text-white'
                                : 'bg-[#201812] text-[#8c7b73] border border-[#33261b]'
                            }`}
                          >
                            {assignedRes ? (isSeated ? 'En Sala' : 'Reservada') : 'Libre'}
                          </span>
                        </div>

                        <div className="my-2">
                          {assignedRes ? (
                            <div className="text-xs space-y-0.5">
                              <p className="font-bold text-white truncate text-sm">
                                {assignedRes.customerName}
                              </p>
                              <p className="text-[#d7ccc8] text-[11px]">
                                {assignedRes.time} h · {assignedRes.guests} comensales (máx {table.capacity})
                              </p>
                              {assignedRes.specialRequests && (
                                <p className="text-[10px] text-[#f6d365] truncate">
                                  "{assignedRes.specialRequests}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-[#8c7b73]">
                              <p>Capacidad: hasta {table.capacity} personas</p>
                              <p className="text-[10px] text-[#6e5d54]">{table.description}</p>
                            </div>
                          )}
                        </div>

                        {/* Interactive Table Button */}
                        <div className="pt-2 border-t border-[#291e16] flex justify-end">
                          {assignedRes ? (
                            <button
                              onClick={() => handleStatusChange(assignedRes.id, 'completada')}
                              className="text-xs font-semibold text-[#bcaaa4] hover:text-white bg-[#221812] hover:bg-[#2d2018] px-2.5 py-1 rounded transition-colors"
                            >
                              Liberar mesa
                            </button>
                          ) : (
                            <button
                              onClick={() => setQuickSeatTableTarget(table)}
                              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/40 px-2.5 py-1 rounded transition-colors"
                            >
                              + Sentar cliente aquí
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Directory */}
        {activeTab === 'clientes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8c7b73]">
              <span>Directorio histórico de comensales ({customers.length})</span>
              <span>Ordenado por fidelidad</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map((c, i) => (
                <div
                  key={i}
                  className="bg-[#18130f] border border-[#2f2218] rounded-lg p-4 space-y-2 hover:border-[#423122] transition-colors"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-display text-base">
                        {c.name}
                      </span>
                      {c.isVIP && (
                        <span className="bg-amber-950/60 text-amber-300 border border-amber-700/40 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#ea580c] font-semibold tabular-nums">
                      {c.totalVisits} {c.totalVisits === 1 ? 'visita' : 'visitas'}
                    </span>
                  </div>

                  <div className="text-xs text-[#a89993] space-y-1">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-[#ea580c]" />
                      <a href={`tel:${c.phone}`} className="hover:underline text-white font-mono">
                        {c.phone}
                      </a>
                    </p>
                    <p>Total comensales aportados: <strong className="text-white">{c.totalGuests} personas</strong></p>
                    <p>Última visita registrada: <strong className="text-white">{c.lastVisit}</strong></p>
                    {c.internalNotes && (
                      <p className="text-[#f6d365] bg-[#221c12] p-1.5 rounded mt-1 text-[11px]">
                        <strong>Nota:</strong> {c.internalNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: DEDICATED SEATING PICKER (SOLVES USER ISSUE DIRECTLY) */}
      {seatingTargetRes && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSeatingTargetRes(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#18130f] border border-[#3e3025] rounded-xl max-w-2xl w-full p-6 text-[#fbf8f5] shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between border-b border-[#2d2218] pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                  Control de Sala & Acomodación
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-0.5">
                  ¿En qué mesa deseas sentar a los comensales?
                </h3>
                <p className="text-xs text-[#d7ccc8] mt-1">
                  Cliente: <strong className="text-white">{seatingTargetRes.customerName}</strong> ·{' '}
                  <strong className="text-[#ea580c]">{seatingTargetRes.guests} comensales</strong> ·{' '}
                  Hora: {seatingTargetRes.time} h
                </p>
              </div>
              <button
                onClick={() => setSeatingTargetRes(null)}
                className="text-[#8c7b73] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of tables to seat */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">
                    Salón Comedor Rústico (12 Mesas Climatizadas)
                  </h4>
                  <span className="text-[11px] text-[#8c7b73]">
                    Comedor interior con zócalos de madera y manteles a cuadros
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RESTAURANT_TABLES.map((table) => {
                    const occupant = occupiedTablesMap.get(table.name);
                    const isCurrent = seatingTargetRes.tableNumber === table.name;
                    const isOccupiedByOther = occupant && occupant.id !== seatingTargetRes.id;
                    const hasSufficientCapacity = table.capacity >= seatingTargetRes.guests;

                    return (
                      <button
                        key={table.id}
                        type="button"
                        disabled={!!isOccupiedByOther}
                        onClick={() => handleTableAssignAndSeat(seatingTargetRes.id, table.name)}
                        className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500'
                            : isOccupiedByOther
                            ? 'bg-[#150f0f] border-red-950/30 opacity-50 cursor-not-allowed'
                            : 'bg-[#1e1712] border-[#382b20] hover:border-[#ea580c] hover:bg-[#261c16]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{table.name}</span>
                            <span className="text-[10px] text-[#ea580c] bg-[#291a13] px-1.5 py-0.5 rounded font-mono">
                              {table.code}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                                Actual
                              </span>
                            )}
                            {!hasSufficientCapacity && (
                              <span className="text-[10px] text-amber-400 bg-amber-950/50 px-1 rounded">
                                Requiere {seatingTargetRes.guests}p
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#a89993] mt-0.5">
                            Capacidad: hasta {table.capacity} pax · {table.description}
                          </p>
                        </div>

                        <div>
                          {isOccupiedByOther ? (
                            <span className="text-[10px] text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/40">
                              Ocupada ({occupant.customerName.split(' ')[0]})
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-700/50 hover:bg-emerald-700 hover:text-white transition-colors">
                              Sentar aquí →
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#2d2218]">
              <button
                type="button"
                onClick={() => setSeatingTargetRes(null)}
                className="px-4 py-2 text-xs font-semibold text-[#a89993] hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK SEAT FROM FREE TABLE IN FLOOR PLAN */}
      {quickSeatTableTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setQuickSeatTableTarget(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#18130f] border border-[#3e3025] rounded-xl max-w-md w-full p-6 text-[#fbf8f5] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2d2218] pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-[#ea580c]">
                  Asignar a {quickSeatTableTarget.name}
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  Selecciona la reserva a sentar:
                </h3>
              </div>
              <button
                onClick={() => setQuickSeatTableTarget(null)}
                className="text-[#8c7b73] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {pendingReservationsForDay.length === 0 ? (
                <p className="text-xs text-[#8c7b73] text-center py-6">
                  No hay reservas pendientes de sentar para este turno. Puedes registrar una nueva reserva manual.
                </p>
              ) : (
                pendingReservationsForDay.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleTableAssignAndSeat(res.id, quickSeatTableTarget.name)}
                    className="w-full text-left p-3 rounded-lg border border-[#33261b] bg-[#1d1611] hover:border-[#ea580c] hover:bg-[#261c16] transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white text-xs block">
                        {res.customerName}
                      </span>
                      <span className="text-[11px] text-[#a89993]">
                        {res.time} h · {res.guests} comensales #{res.code}
                      </span>
                    </div>
                    <span className="text-xs text-[#ea580c] font-bold">
                      Sentar en {quickSeatTableTarget.code} →
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#2d2218]">
              <button
                onClick={() => setQuickSeatTableTarget(null)}
                className="px-4 py-2 text-xs text-[#a89993] hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Walk-in / Phone Reservation */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#18130f] border border-[#3e3025] rounded-xl max-w-lg w-full p-6 text-[#fbf8f5] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2d2218] pb-3">
              <h3 className="text-lg font-bold text-white font-display">
                + Nueva Reserva de Sala (Teléfono / Puerta)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8c7b73] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Nombre Cliente *</label>
                  <input
                    type="text"
                    required
                    value={newResName}
                    onChange={(e) => setNewResName(e.target.value)}
                    placeholder="Ej. Roberto Sánchez"
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={newResPhone}
                    onChange={(e) => setNewResPhone(e.target.value)}
                    placeholder="+34 600 00 00 00"
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={newResDate}
                    onChange={(e) => setNewResDate(e.target.value)}
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Hora *</label>
                  <input
                    type="text"
                    required
                    value={newResTime}
                    onChange={(e) => setNewResTime(e.target.value)}
                    placeholder="14:00"
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Comensales *</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={newResGuests}
                    onChange={(e) => setNewResGuests(Number(e.target.value))}
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Turno</label>
                  <select
                    value={newResShift}
                    onChange={(e) => setNewResShift(e.target.value as ReservationShift)}
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="mediodia">Almuerzo (Mediodía)</option>
                    <option value="noche">Cena (Noche)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#a89993] mb-1 font-medium">Asignar Mesa (Salón Interior) *</label>
                  <select
                    value={newResTable}
                    onChange={(e) => setNewResTable(e.target.value)}
                    className="w-full bg-[#120e0b] border border-[#33261b] rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                  >
                    <optgroup label="Salón Rústico Climatizado (12 Mesas)">
                      {RESTAURANT_TABLES.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.code}) — hasta {t.capacity} pax ({t.description})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a89993] mb-1 font-medium">Peticiones o Alérgenos</label>
                <input
                  type="text"
                  value={newResRequests}
                  onChange={(e) => setNewResRequests(e.target.value)}
                  placeholder="Ej. Sin gluten, trona infantil..."
                  className="w-full bg-[#120e0b] border border-[#33261b] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-[#a89993] mb-1 font-medium">Notas de Servicio Internas</label>
                <input
                  type="text"
                  value={newResStaffNotes}
                  onChange={(e) => setNewResStaffNotes(e.target.value)}
                  placeholder="Ej. Llamó por teléfono el cliente habitual..."
                  className="w-full bg-[#120e0b] border border-[#33261b] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newResVIP"
                  checked={newResIsVIP}
                  onChange={(e) => setNewResIsVIP(e.target.checked)}
                  className="accent-[#ea580c]"
                />
                <label htmlFor="newResVIP" className="text-white cursor-pointer select-none">
                  Marcar como cliente VIP
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2d2218]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded text-[#a89993] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded shadow-md"
                >
                  Guardar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
