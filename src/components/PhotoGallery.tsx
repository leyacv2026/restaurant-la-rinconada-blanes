import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/restaurantData';
import { GalleryPhoto } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openLightbox = (photo: GalleryPhoto, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIdx = (currentIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
    setCurrentIndex(newIdx);
    setSelectedPhoto(GALLERY_PHOTOS[newIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIdx = (currentIndex + 1) % GALLERY_PHOTOS.length;
    setCurrentIndex(newIdx);
    setSelectedPhoto(GALLERY_PHOTOS[newIdx]);
  };

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-[#16120e] text-[#fbf8f5] border-b border-[#2d241c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#ea580c] font-semibold mb-1">
              <Camera className="w-4 h-4" />
              <span>Galería Auténtica</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Nuestra Casa en Imágenes Reales
            </h2>
            <p className="text-sm sm:text-base text-[#bcaaa4] mt-2 max-w-2xl font-light">
              Sin artificios ni adornos innecesarios: te mostramos nuestras instalaciones reales en Blanes,
              nuestro acogedor salón comedor rústico climatizado y el auténtico fuego de nuestras brasas.
            </p>
          </div>

          <div className="text-xs text-[#a89993]">
            Haz clic en cualquier imagen para ampliar
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(photo, idx)}
              className="group relative bg-[#1f1813] border border-[#33261c] rounded-lg overflow-hidden cursor-pointer shadow-md hover:border-[#ea580c]/60 transition-all duration-200"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#241c16]">
                <img
                  src={photo.imageUrl}
                  alt={photo.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag & Info */}
              <div className="absolute top-3 left-3">
                <span className="text-xs font-medium text-white/90 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  {photo.tag}
                </span>
              </div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 text-white p-1.5 rounded-full">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-base font-semibold font-display">
                  {photo.title}
                </h3>
                <p className="text-xs text-[#d7ccc8] mt-0.5 line-clamp-2">
                  {photo.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#1b1510] border border-[#3e3025] rounded-lg overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/60 rounded-full transition-colors"
              aria-label="Cerrar vista"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 text-white/90 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 text-white/90 hover:text-white bg-black/60 hover:bg-black/80 rounded-full transition-colors"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image display */}
            <div className="max-h-[70vh] flex items-center justify-center bg-black/40">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Caption */}
            <div className="p-5 border-t border-[#33261c] bg-[#16120e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#ea580c] font-medium mb-1">
                  <span>{selectedPhoto.tag}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentIndex + 1} de {GALLERY_PHOTOS.length}</span>
                </div>
                <h4 className="text-lg font-bold text-white font-display">
                  {selectedPhoto.title}
                </h4>
                <p className="text-sm text-[#d7ccc8] mt-0.5">
                  {selectedPhoto.subtitle}
                </p>
              </div>

              <div className="text-xs text-[#a89993] shrink-0">
                Restaurante Asador La Rinconada · Blanes
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
