export interface Destination {
  id: string;
  name: string;
  country: string;
  state: string;
  continent: string;
  image: string;
  description: string;
  bestTimeToVisit: string;
  latitude: number;
  longitude: number;

  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
}
