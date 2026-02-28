'use client';

import { useEffect, useRef } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';
import type { MapPosition } from '@/types/map';

interface PopulationDensity {
  dongCode: string;
  dongName: string;
  population: number;
  density: number; // per km²
  boundary: MapPosition[];
}

interface PopulationHeatmapProps {
  adapter: MapAdapterInterface | null;
  visible: boolean;
  data?: PopulationDensity[];
}

const DENSITY_COLORS = [
  { threshold: 0, color: '#F3F4F6' },      // very low
  { threshold: 5000, color: '#DBEAFE' },    // low
  { threshold: 10000, color: '#93C5FD' },   // moderate
  { threshold: 20000, color: '#3B82F6' },   // high
  { threshold: 30000, color: '#1D4ED8' },   // very high
  { threshold: 50000, color: '#1E3A8A' },   // extreme
];

function getDensityColor(density: number): string {
  let color = DENSITY_COLORS[0].color;
  for (const level of DENSITY_COLORS) {
    if (density >= level.threshold) {
      color = level.color;
    }
  }
  return color;
}

// Sample data for Seoul districts (approximate boundaries)
const SAMPLE_DATA: PopulationDensity[] = [
  {
    dongCode: '1168010100',
    dongName: '역삼1동',
    population: 28500,
    density: 22000,
    boundary: [
      { lat: 37.5005, lng: 127.0340 },
      { lat: 37.5005, lng: 127.0430 },
      { lat: 37.4965, lng: 127.0430 },
      { lat: 37.4965, lng: 127.0340 },
    ],
  },
  {
    dongCode: '1168010200',
    dongName: '역삼2동',
    population: 32100,
    density: 25000,
    boundary: [
      { lat: 37.4965, lng: 127.0340 },
      { lat: 37.4965, lng: 127.0430 },
      { lat: 37.4920, lng: 127.0430 },
      { lat: 37.4920, lng: 127.0340 },
    ],
  },
  {
    dongCode: '1168010300',
    dongName: '삼성1동',
    population: 19800,
    density: 15000,
    boundary: [
      { lat: 37.5080, lng: 127.0550 },
      { lat: 37.5080, lng: 127.0650 },
      { lat: 37.5030, lng: 127.0650 },
      { lat: 37.5030, lng: 127.0550 },
    ],
  },
  {
    dongCode: '1168010400',
    dongName: '대치동',
    population: 45200,
    density: 35000,
    boundary: [
      { lat: 37.4980, lng: 127.0550 },
      { lat: 37.4980, lng: 127.0680 },
      { lat: 37.4920, lng: 127.0680 },
      { lat: 37.4920, lng: 127.0550 },
    ],
  },
  {
    dongCode: '1168010500',
    dongName: '논현동',
    population: 38000,
    density: 28000,
    boundary: [
      { lat: 37.5110, lng: 127.0200 },
      { lat: 37.5110, lng: 127.0340 },
      { lat: 37.5050, lng: 127.0340 },
      { lat: 37.5050, lng: 127.0200 },
    ],
  },
];

export function PopulationHeatmap({ adapter, visible, data }: PopulationHeatmapProps) {
  const polygonIdsRef = useRef<string[]>([]);
  const displayData = data || SAMPLE_DATA;

  useEffect(() => {
    if (!adapter) return;

    // Clear existing polygons
    polygonIdsRef.current.forEach((id) => {
      adapter.removePolygon(id);
    });
    polygonIdsRef.current = [];

    if (!visible) return;

    // Add density polygons
    displayData.forEach((dong) => {
      const color = getDensityColor(dong.density);
      const polygonId = `pop_${dong.dongCode}`;

      adapter.addPolygon(polygonId, dong.boundary, {
        fillColor: color,
        fillOpacity: 0.5,
        strokeColor: '#6B7280',
        strokeWeight: 1,
      });

      polygonIdsRef.current.push(polygonId);
    });

    return () => {
      polygonIdsRef.current.forEach((id) => {
        adapter.removePolygon(id);
      });
      polygonIdsRef.current = [];
    };
  }, [adapter, visible, displayData]);

  return null;
}
