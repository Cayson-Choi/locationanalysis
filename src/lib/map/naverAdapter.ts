import type { MapPosition, MapBounds, MarkerOptions, CircleOptions, MapEventData } from '@/types/map';
import { type MapAdapterInterface, generateMarkerId, generateCircleId } from './mapAdapter';

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (container: HTMLElement | string, options: Record<string, unknown>) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        LatLngBounds: new (sw: NaverLatLng, ne: NaverLatLng) => NaverLatLngBounds;
        Marker: new (options: Record<string, unknown>) => NaverMarker;
        Circle: new (options: Record<string, unknown>) => NaverCircle;
        Polygon: new (options: Record<string, unknown>) => NaverPolygon;
        Event: {
          addListener: (target: unknown, type: string, handler: (...args: unknown[]) => void) => NaverEventListener;
          removeListener: (listener: NaverEventListener) => void;
        };
        MarkerClustering?: new (options: Record<string, unknown>) => NaverClusterer;
      };
    };
  }
}

interface NaverMap {
  setCenter: (latlng: NaverLatLng) => void;
  getCenter: () => NaverLatLng;
  setZoom: (level: number) => void;
  getZoom: () => number;
  getBounds: () => NaverLatLngBounds;
  fitBounds: (bounds: NaverLatLngBounds) => void;
  destroy: () => void;
}

interface NaverLatLng {
  lat: () => number;
  lng: () => number;
}

interface NaverLatLngBounds {
  getSW: () => NaverLatLng;
  getNE: () => NaverLatLng;
  extend: (latlng: NaverLatLng) => void;
}

interface NaverMarker {
  setMap: (map: NaverMap | null) => void;
  getPosition: () => NaverLatLng;
}

interface NaverCircle {
  setMap: (map: NaverMap | null) => void;
}

interface NaverPolygon {
  setMap: (map: NaverMap | null) => void;
}

interface NaverClusterer {
  setMap: (map: NaverMap | null) => void;
}

interface NaverEventListener {
  _id: string;
}

export class NaverMapAdapter implements MapAdapterInterface {
  private map: NaverMap | null = null;
  private markers = new Map<string, NaverMarker>();
  private circles = new Map<string, NaverCircle>();
  private polygons = new Map<string, NaverPolygon>();
  private clusterer: NaverClusterer | null = null;
  private eventListeners = new Map<string, NaverEventListener>();

  initialize(container: HTMLElement, options: { center: MapPosition; zoom: number }): void {
    const { naver } = window;
    if (!naver?.maps) return;

    const center = new naver.maps.LatLng(options.center.lat, options.center.lng);
    this.map = new naver.maps.Map(container, {
      center,
      zoom: options.zoom,
    });
  }

  setCenter(lat: number, lng: number): void {
    if (!this.map) return;
    const { naver } = window;
    this.map.setCenter(new naver.maps.LatLng(lat, lng));
  }

  getCenter(): MapPosition {
    if (!this.map) return { lat: 37.5665, lng: 126.978 };
    const center = this.map.getCenter();
    return { lat: center.lat(), lng: center.lng() };
  }

  setZoom(level: number): void {
    if (!this.map) return;
    this.map.setZoom(level);
  }

  getZoom(): number {
    if (!this.map) return 15;
    return this.map.getZoom();
  }

  addMarker(options: MarkerOptions): string {
    if (!this.map) return '';
    const { naver } = window;
    const id = generateMarkerId();

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(options.position.lat, options.position.lng),
      map: this.map,
      clickable: options.clickable ?? true,
    });

    if (options.clickable !== false && options.data) {
      naver.maps.Event.addListener(marker, 'click', () => {
        // Trigger our own event handler
      });
    }

    this.markers.set(id, marker);
    return id;
  }

  removeMarker(id: string): void {
    const marker = this.markers.get(id);
    if (marker) {
      marker.setMap(null);
      this.markers.delete(id);
    }
  }

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers.clear();
  }

  addCircle(options: CircleOptions): string {
    if (!this.map) return '';
    const { naver } = window;
    const id = generateCircleId();

    const circle = new naver.maps.Circle({
      center: new naver.maps.LatLng(options.center.lat, options.center.lng),
      radius: options.radius,
      strokeWeight: options.strokeWeight ?? 2,
      strokeColor: options.strokeColor ?? '#3B82F6',
      strokeOpacity: 0.8,
      fillColor: options.fillColor ?? '#3B82F6',
      fillOpacity: options.fillOpacity ?? 0.1,
      map: this.map,
    });

    this.circles.set(id, circle);
    return id;
  }

  removeCircle(id: string): void {
    const circle = this.circles.get(id);
    if (circle) {
      circle.setMap(null);
      this.circles.delete(id);
    }
  }

  clearCircles(): void {
    this.circles.forEach((circle) => circle.setMap(null));
    this.circles.clear();
  }

  addClusterer(_markerIds: string[]): void {
    // Naver Maps clusterer requires separate library
    // Will be implemented when naver MarkerClustering is available
  }

  removeClusterer(): void {
    if (this.clusterer) {
      this.clusterer.setMap(null);
      this.clusterer = null;
    }
  }

  addPolygon(
    id: string,
    paths: MapPosition[],
    options?: { fillColor?: string; fillOpacity?: number; strokeColor?: string; strokeWeight?: number }
  ): void {
    if (!this.map) return;
    const { naver } = window;

    const path = paths.map((p) => new naver.maps.LatLng(p.lat, p.lng));

    const polygon = new naver.maps.Polygon({
      paths: [path],
      strokeWeight: options?.strokeWeight ?? 2,
      strokeColor: options?.strokeColor ?? '#3B82F6',
      strokeOpacity: 0.8,
      fillColor: options?.fillColor ?? '#3B82F6',
      fillOpacity: options?.fillOpacity ?? 0.3,
      map: this.map,
    });

    this.polygons.set(id, polygon);
  }

  removePolygon(id: string): void {
    const polygon = this.polygons.get(id);
    if (polygon) {
      polygon.setMap(null);
      this.polygons.delete(id);
    }
  }

  addEventListener(event: string, handler: (e: MapEventData) => void): void {
    if (!this.map) return;
    const { naver } = window;

    const wrappedHandler = (...args: unknown[]) => {
      const mouseEvent = args[0] as { coord?: NaverLatLng } | undefined;
      handler({
        position: mouseEvent?.coord
          ? { lat: mouseEvent.coord.lat(), lng: mouseEvent.coord.lng() }
          : undefined,
        zoom: this.getZoom(),
        bounds: this.getBounds(),
      });
    };

    const listener = naver.maps.Event.addListener(this.map, event, wrappedHandler);
    this.eventListeners.set(event, listener);
  }

  removeEventListener(event: string): void {
    const { naver } = window;
    const listener = this.eventListeners.get(event);
    if (listener) {
      naver.maps.Event.removeListener(listener);
      this.eventListeners.delete(event);
    }
  }

  getBounds(): MapBounds {
    if (!this.map) return { sw: { lat: 0, lng: 0 }, ne: { lat: 0, lng: 0 } };
    const bounds = this.map.getBounds();
    const sw = bounds.getSW();
    const ne = bounds.getNE();
    return {
      sw: { lat: sw.lat(), lng: sw.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() },
    };
  }

  fitBounds(bounds: MapBounds): void {
    if (!this.map) return;
    const { naver } = window;
    const naverBounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
      new naver.maps.LatLng(bounds.ne.lat, bounds.ne.lng)
    );
    this.map.fitBounds(naverBounds);
  }

  destroy(): void {
    this.clearMarkers();
    this.clearCircles();
    this.removeClusterer();
    this.polygons.forEach((p) => p.setMap(null));
    this.polygons.clear();
    this.eventListeners.clear();
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }
}
