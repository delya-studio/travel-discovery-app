export type TouristSpot = {
  id: string;
  name: string;
  destinationId: string;
  location: string;
  image: string;
  description: string;
  category: string;
  openingHours: string;
  price: string;
  gallery: string[];
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
};
