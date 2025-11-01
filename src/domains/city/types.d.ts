namespace Domain {
  export interface City {
    id: string;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population?: number;
    numberOfSearches?: number;
    timezone: number;
    sunrise: number;
    sunset: number;
    createdAt: Date;
    updatedAt: Date;
  }
}
