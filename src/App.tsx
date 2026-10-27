import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PizarraHighlight } from './components/PizarraHighlight';
import { MenuSection } from './components/MenuSection';
import { PhotoGallery } from './components/PhotoGallery';
import { ReservationSection } from './components/ReservationSection';
import { AboutSection } from './components/AboutSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { CRMAuthModal } from './components/crm/CRMAuthModal';
import { ReservationCRM } from './components/crm/ReservationCRM';
import { Reservation, ReservationShift, MenuItem } from './types';
import { getStoredReservations, isCRMAuthenticated } from './utils/storage';

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // CRM Staff States (hidden from general diners)
  const [isCRMOpen, setIsCRMOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Quick book pre-selection states
  const [bookingDate, setBookingDate] = useState<string | undefined>();
  const [bookingShift, setBookingShift] = useState<ReservationShift>('mediodia');
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [bookingDishNote, setBookingDishNote] = useState<string>('');

  useEffect(() => {
    setReservations(getStoredReservations());

    // Check if staff opened with #crm or #admin hash in URL
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#crm' || hash === '#admin') {
        if (isCRMAuthenticated()) {
          setIsCRMOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Keyboard shortcut for staff: Alt + Shift + C
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        if (isCRMAuthenticated()) {
          setIsCRMOpen((prev) => !prev);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleReservationCreated = (newReservation: Reservation) => {
    setReservations((prev) => [newReservation, ...prev]);
  };

  const handleStaffCRMClick = () => {
    if (isCRMAuthenticated()) {
      setIsCRMOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsCRMOpen(true);
  };

  const scrollToBooking = () => {
    const el = document.getElementById('reservas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickBook = (date?: string, shift?: ReservationShift, guests?: number) => {
    if (date) setBookingDate(date);
    if (shift) setBookingShift(shift);
    if (guests) setBookingGuests(guests);
    scrollToBooking();
  };

  const handleDishSelectForBooking = (item: MenuItem) => {
    setBookingDishNote(`Queremos degustar: ${item.name} (${item.price.toFixed(2)} €)`);
    scrollToBooking();
  };

  // If CRM is open for staff, render the staff CRM interface
  if (isCRMOpen) {
    return (
      <ReservationCRM
        reservations={reservations}
        onReservationsChange={(updated) => setReservations(updated)}
        onExitCRM={() => {
          setIsCRMOpen(false);
          if (window.location.hash === '#crm' || window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    );
  }

  // Otherwise render clean, client-facing restaurant website (no CRM elements visible to diners)
  return (
    <div className="min-h-screen bg-[#16120e] text-[#fbf8f5] flex flex-col font-sans selection:bg-[#ea580c] selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        onOpenBooking={scrollToBooking}
        onOpenStaffCRM={handleStaffCRMClick}
      />

      <main className="flex-1">
        {/* Hero Section with authentic photo anchor & quick booking */}
        <Hero
          onQuickBook={handleQuickBook}
          onOpenBooking={scrollToBooking}
        />

        {/* Pizarra Highlight with authentic 18,50 € chalkboard menu photo */}
        <PizarraHighlight onBookMenu={scrollToBooking} />

        {/* Full Gastronomic Menu */}
        <MenuSection onSelectForBooking={handleDishSelectForBooking} />

        {/* Authentic Photo Gallery (Real photos from Blanes) */}
        <PhotoGallery />

        {/* Interactive Reservation Section for Diners */}
        <ReservationSection
          initialDate={bookingDate}
          initialShift={bookingShift}
          initialGuests={bookingGuests}
          initialDishNote={bookingDishNote}
          onReservationCreated={handleReservationCreated}
        />

        {/* Story & Essence of the Charcoal Grill with authentic interior photo */}
        <AboutSection />

        {/* Map, Directions, Hours & Direct Contact */}
        <LocationSection onOpenBooking={scrollToBooking} />
      </main>

      {/* Clean Footer with discreet staff lock entry */}
      <Footer
        onOpenBooking={scrollToBooking}
        onOpenStaffCRM={handleStaffCRMClick}
      />

      {/* PIN-Protected Staff Authentication Modal */}
      <CRMAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
