import { ImageSourcePropType } from "react-native";
export type TouristSpot = {
  id: string;
  name: string;
  destinationId: string;
  location: string;
  image: ImageSourcePropType;
  description: string;
  category: string;
  openingHours: string;
  price: string;
  gallery: string[];
};
