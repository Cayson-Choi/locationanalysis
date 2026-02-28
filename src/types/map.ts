export type MapProvider = 'kakao';

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapBounds {
  sw: MapPosition;
  ne: MapPosition;
}

export interface MarkerOptions {
  position: MapPosition;
  title?: string;
  color?: string;
  icon?: string;
  clickable?: boolean;
  data?: Record<string, unknown>;
}

export interface CircleOptions {
  center: MapPosition;
  radius: number;
  strokeColor?: string;
  strokeWeight?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export interface MapAdapter {
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
  addClusterer(markerIds: string[]): void;
  addEventListener(event: string, handler: (e: MapEventData) => void): void;
  removeEventListener(event: string): void;
  getBounds(): MapBounds;
  destroy(): void;
}

export interface MapEventData {
  position?: MapPosition;
  zoom?: number;
  bounds?: MapBounds;
  markerId?: string;
}
