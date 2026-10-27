import { TableZone } from '../types';

export interface RestaurantTable {
  id: string;
  name: string;
  code: string;
  zone: TableZone;
  capacity: number;
  description: string;
}

// All tables are inside the authentic rustic dining room (the restaurant has no outdoor or terrace seating)
export const RESTAURANT_TABLES: RestaurantTable[] = [
  { id: 'm1', name: 'Mesa 1', code: 'M-1', zone: 'zona_tranquila', capacity: 2, description: 'Rincón íntimo de 2 plazas junto a la pared rústica' },
  { id: 'm2', name: 'Mesa 2', code: 'M-2', zone: 'zona_tranquila', capacity: 2, description: 'Mesa de pareja con aplique de luz cálida tradicional' },
  { id: 'm3', name: 'Mesa 3', code: 'M-3', zone: 'salon', capacity: 4, description: 'Mesa clásica de 4 comensales con mantel a cuadros' },
  { id: 'm4', name: 'Mesa 4', code: 'M-4', zone: 'salon', capacity: 4, description: 'Frente a las hornacinas iluminadas con vasijas rústicas' },
  { id: 'm5', name: 'Mesa 5', code: 'M-5', zone: 'salon', capacity: 4, description: 'Mesa central de madera con servicio completo' },
  { id: 'm6', name: 'Mesa 6', code: 'M-6', zone: 'familiar', capacity: 4, description: 'Espaciosa para comida o cena familiar' },
  { id: 'm7', name: 'Mesa 7', code: 'M-7', zone: 'familiar', capacity: 6, description: 'Mesa amplia para grupos, ideal para parrilladas combinadas' },
  { id: 'm8', name: 'Mesa 8', code: 'M-8', zone: 'familiar', capacity: 6, description: 'Junto al zócalo de madera natural' },
  { id: 'm9', name: 'Mesa 9', code: 'M-9', zone: 'familiar', capacity: 6, description: 'Mesa espaciosa para grupos medianos' },
  { id: 'm10', name: 'Mesa 10', code: 'M-10', zone: 'familiar', capacity: 8, description: 'Mesa larga de madera maciza para familias numerosas' },
  { id: 'm11', name: 'Mesa 11', code: 'M-11', zone: 'familiar', capacity: 8, description: 'Zona posterior tranquila del salón comedor' },
  { id: 'm12', name: 'Mesa 12', code: 'M-12', zone: 'familiar', capacity: 10, description: 'Gran mesa imperial para celebraciones de grupo' },
];

export function findBestTableFor(zone: TableZone, guests: number, occupiedTableNames: string[]): RestaurantTable | null {
  const candidates = RESTAURANT_TABLES.filter((t) => {
    // Check capacity
    if (t.capacity < guests) return false;
    // Check if already occupied
    if (occupiedTableNames.includes(t.name)) return false;
    return true;
  });

  // Sort by closest capacity to avoid wasting huge tables on 2 people
  candidates.sort((a, b) => a.capacity - b.capacity);
  return candidates[0] || RESTAURANT_TABLES[2];
}
