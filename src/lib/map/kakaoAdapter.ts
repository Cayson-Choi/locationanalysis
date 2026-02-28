import type { MapPosition, MapBounds, MarkerOptions, CircleOptions, MapEventData } from '@/types/map';
import { type MapAdapterInterface, generateMarkerId, generateCircleId } from './mapAdapter';

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: Record<string, unknown>) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        LatLngBounds: new (sw: KakaoLatLng, ne: KakaoLatLng) => KakaoLatLngBounds;
        Marker: new (options: Record<string, unknown>) => KakaoMarker;
        MarkerImage: new (src: string, size: KakaoSize, options?: Record<string, unknown>) => KakaoMarkerImage;
        Size: new (width: number, height: number) => KakaoSize;
        Point: new (x: number, y: number) => KakaoPoint;
        Circle: new (options: Record<string, unknown>) => KakaoCircle;
        Polygon: new (options: Record<string, unknown>) => KakaoPolygon;
        MarkerClusterer: new (options: Record<string, unknown>) => KakaoClusterer;
        event: {
          addListener: (target: unknown, type: string, handler: (...args: unknown[]) => void) => void;
          removeListener: (target: unknown, type: string, handler: (...args: unknown[]) => void) => void;
        };
      };
    };
  }
}

interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  getCenter: () => KakaoLatLng;
  setLevel: (level: number) => void;
  getLevel: () => number;
  getBounds: () => KakaoLatLngBounds;
  setBounds: (bounds: KakaoLatLngBounds) => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoLatLngBounds {
  getSouthWest: () => KakaoLatLng;
  getNorthEast: () => KakaoLatLng;
  extend: (latlng: KakaoLatLng) => void;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  getPosition: () => KakaoLatLng;
}

interface KakaoCircle {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoPolygon {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoClusterer {
  addMarkers: (markers: KakaoMarker[]) => void;
  clear: () => void;
  setMap: (map: KakaoMap | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface KakaoMarkerImage {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface KakaoSize {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface KakaoPoint {}

function createColoredMarkerImage(color: string) {
  const { kakao } = window;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const size = new kakao.maps.Size(24, 24);
  const offset = new kakao.maps.Point(12, 12);
  return new kakao.maps.MarkerImage(url, size, { offset });
}

export class KakaoMapAdapter implements MapAdapterInterface {
  private map: KakaoMap | null = null;
  private markers = new Map<string, KakaoMarker>();
  private circles = new Map<string, KakaoCircle>();
  private polygons = new Map<string, KakaoPolygon>();
  private clusterer: KakaoClusterer | null = null;
  private eventHandlers = new Map<string, (...args: unknown[]) => void>();

  initialize(container: HTMLElement, options: { center: MapPosition; zoom: number }): void {
    const { kakao } = window;
    if (!kakao?.maps) return;

    const center = new kakao.maps.LatLng(options.center.lat, options.center.lng);
    this.map = new kakao.maps.Map(container, {
      center,
      level: this.zoomToLevel(options.zoom),
    });
  }

  setCenter(lat: number, lng: number): void {
    if (!this.map) return;
    const { kakao } = window;
    this.map.setCenter(new kakao.maps.LatLng(lat, lng));
  }

  getCenter(): MapPosition {
    if (!this.map) return { lat: 37.5665, lng: 126.978 };
    const center = this.map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  }

  setZoom(level: number): void {
    if (!this.map) return;
    this.map.setLevel(this.zoomToLevel(level));
  }

  getZoom(): number {
    if (!this.map) return 15;
    return this.levelToZoom(this.map.getLevel());
  }

  addMarker(options: MarkerOptions): string {
    if (!this.map) return '';
    const { kakao } = window;
    const id = generateMarkerId();
    const position = new kakao.maps.LatLng(options.position.lat, options.position.lng);

    const markerOpts: Record<string, unknown> = {
      position,
      map: this.map,
      clickable: options.clickable ?? true,
    };

    if (options.color) {
      markerOpts.image = createColoredMarkerImage(options.color);
    }

    const marker = new kakao.maps.Marker(markerOpts);

    if (options.clickable !== false && options.data) {
      kakao.maps.event.addListener(marker, 'click', () => {
        this.eventHandlers.get('markerClick')?.({
          markerId: id,
          position: options.position,
          data: options.data,
        });
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
    const { kakao } = window;
    const id = generateCircleId();
    const center = new kakao.maps.LatLng(options.center.lat, options.center.lng);

    const circle = new kakao.maps.Circle({
      center,
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

  addClusterer(markerIds: string[]): void {
    if (!this.map) return;
    const { kakao } = window;

    this.removeClusterer();

    const markers = markerIds
      .map((id) => this.markers.get(id))
      .filter((m): m is KakaoMarker => !!m);

    this.clusterer = new kakao.maps.MarkerClusterer({
      map: this.map,
      averageCenter: true,
      minLevel: 5,
    });

    this.clusterer.addMarkers(markers);
  }

  removeClusterer(): void {
    if (this.clusterer) {
      this.clusterer.clear();
      this.clusterer = null;
    }
  }

  addPolygon(
    id: string,
    paths: MapPosition[],
    options?: { fillColor?: string; fillOpacity?: number; strokeColor?: string; strokeWeight?: number }
  ): void {
    if (!this.map) return;
    const { kakao } = window;

    const path = paths.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

    const polygon = new kakao.maps.Polygon({
      path,
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
    const { kakao } = window;

    const wrappedHandler = (...args: unknown[]) => {
      const mouseEvent = args[0] as { latLng?: KakaoLatLng } | undefined;
      handler({
        position: mouseEvent?.latLng
          ? { lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng() }
          : undefined,
        zoom: this.getZoom(),
        bounds: this.getBounds(),
      });
    };

    this.eventHandlers.set(event, wrappedHandler);

    const kakaoEvent = event === 'click' ? 'click' : event === 'idle' ? 'idle' : event;
    kakao.maps.event.addListener(this.map, kakaoEvent, wrappedHandler);
  }

  removeEventListener(event: string): void {
    if (!this.map) return;
    const { kakao } = window;
    const handler = this.eventHandlers.get(event);
    if (handler) {
      kakao.maps.event.removeListener(this.map, event, handler);
      this.eventHandlers.delete(event);
    }
  }

  getBounds(): MapBounds {
    if (!this.map) return { sw: { lat: 0, lng: 0 }, ne: { lat: 0, lng: 0 } };
    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
      sw: { lat: sw.getLat(), lng: sw.getLng() },
      ne: { lat: ne.getLat(), lng: ne.getLng() },
    };
  }

  fitBounds(bounds: MapBounds): void {
    if (!this.map) return;
    const { kakao } = window;
    const kakaoBounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
      new kakao.maps.LatLng(bounds.ne.lat, bounds.ne.lng)
    );
    this.map.setBounds(kakaoBounds);
  }

  destroy(): void {
    this.clearMarkers();
    this.clearCircles();
    this.removeClusterer();
    this.polygons.forEach((p) => p.setMap(null));
    this.polygons.clear();
    this.eventHandlers.clear();
    this.map = null;
  }

  // Kakao zoom level: 1(closest) to 14(farthest), opposite of typical zoom
  private zoomToLevel(zoom: number): number {
    return Math.max(1, Math.min(14, 21 - zoom));
  }

  private levelToZoom(level: number): number {
    return 21 - level;
  }
}
