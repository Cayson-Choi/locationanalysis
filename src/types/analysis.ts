export interface AnalysisReport {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radius: number;
  industry: IndustryData;
  population: PopulationData;
  rent: RentData;
  transport: TransportData;
  competition: CompetitionData;
  freshness: DataFreshness;
  reliability: DataReliability;
  createdAt: string;
}

export interface IndustryData {
  totalBusinesses: number;
  categories: IndustryCategoryItem[];
  topCategories: IndustryCategoryItem[];
  density: number;
}

export interface IndustryCategoryItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PopulationData {
  totalPopulation: number;
  density: number;
  ageDistribution: AgeGroup[];
  genderRatio: { male: number; female: number };
  households: number;
  floatingPopulation?: FloatingPopulationItem[];
}

export interface AgeGroup {
  label: string;
  male: number;
  female: number;
}

export interface FloatingPopulationItem {
  hour: number;
  count: number;
}

export interface RentData {
  avgRentPerSqm: number;
  vacancyRate: number;
  trends: RentTrendItem[];
  transactions: RealEstateTransaction[];
}

export interface RentTrendItem {
  period: string;
  rent: number;
  vacancyRate: number;
}

export interface RealEstateTransaction {
  date: string;
  type: string;
  area: number;
  price: number;
  floor: number;
  address: string;
}

export interface TransportData {
  busStops: number;
  subwayStations: number;
  accessibilityScore: number;
  stops: TransportStop[];
}

export interface TransportStop {
  name: string;
  type: 'bus' | 'subway';
  distance: number;
  lines: string[];
}

export interface CompetitionData {
  sameIndustryCount: number;
  competitionDensity: number;
  saturationIndex: number;
  matrix: CompetitionMatrixItem[];
}

export interface CompetitionMatrixItem {
  category: string;
  count: number;
  avgDistance: number;
  density: number;
}

export type FreshnessLevel = 'fresh' | 'stale' | 'expired';

export interface DataFreshness {
  businesses: FreshnessLevel;
  population: FreshnessLevel;
  rent: FreshnessLevel;
  transport: FreshnessLevel;
}

export type ReliabilityLevel = 'high' | 'medium' | 'low';

export interface DataReliability {
  overall: ReliabilityLevel;
  availableSources: number;
  totalSources: number;
}
