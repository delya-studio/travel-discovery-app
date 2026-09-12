import type { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;

  Explorar: {
    country?: string;
    state?: string;
  };

  Viagens: undefined;

  Favoritos: undefined;

  Perfil: undefined;
};

export type RootStackParamList = {
  Splash: undefined;

  Main: NavigatorScreenParams<MainTabParamList>;

  Explore: {
    country?: string;
    state?: string;
  };

  Trips: undefined;

  TripDetails: {
    tripId: string;
  };

  Destination: {
    destinationId: string;
  };

  TouristSpot: {
    touristSpotId: string;
  };

  TouristSpots: {
    destinationId: string;
  };
};
