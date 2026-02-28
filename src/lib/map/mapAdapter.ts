import type { MapPosition, MapBounds, MarkerOptions, CircleOptions, MapEventData } from '@/types/map';

export interface MapAdapterInterface {
  initialize(container: HTMLElement, options: { center: MapPosition; zoom: number }): void;
  setCenter(lat: number, lng: number): void;
  getCenter(): MapPosition;
  setZoom(level: number): void;
  getZoom(): number;
  addMarker(options: MarkerOptions): string;
  removeMarker(id: string): void;
  clearMarkers(): void;
  addCircle(options: CircleOptions): string;
  removeCircle(id: string): void;
  clearCircles(): void;
  addClusterer(markerIds: string[]): void;
  removeClusterer(): void;
  addPolygon(id: string, paths: MapPosition[], options?: { fillColor?: string; fillOpacity?: number; strokeColor?: string; strokeWeight?: number }): void;
  removePolygon(id: string): void;
  addEventListener(event: string, handler: (e: MapEventData) => void): void;
  removeEventListener(event: string): void;
  getBounds(): MapBounds;
  fitBounds(bounds: MapBounds): void;
  destroy(): void;
}

let markerIdCounter = 0;
export function generateMarkerId(): string {
  return `marker_${++markerIdCounter}`;
}

let circleIdCounter = 0;
export function generateCircleId(): string {
  return `circle_${++circleIdCounter}`;
}
