import { ImageSourcePropType } from "react-native";
export interface Destination {
  id: string;
  name: string;
  country: string;
  state: string;
  continent: string;
  image: ImageSourcePropType;
  description: string;
  bestTimeToVisit: string;
  toVisitDesc: string;
  latitude: number;
  longitude: number;

  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
}
