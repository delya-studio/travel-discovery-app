import AsyncStorage from "@react-native-async-storage/async-storage";

import { getLoggedUser } from "./auth";

const getStorageKey = (email: string) => {
  return `@tryple_favorites_${email}`;
};

type FavoriteData = {
  destinations: string[];
  touristSpots: string[];
};

const getFavoriteData = async (): Promise<FavoriteData> => {
  const user = await getLoggedUser();

  if (!user) {
    return {
      destinations: [],
      touristSpots: [],
    };
  }

  const key = getStorageKey(user.email);
  const storedData = await AsyncStorage.getItem(key);

  if (!storedData) {
    return {
      destinations: [],
      touristSpots: [],
    };
  }

  return JSON.parse(storedData);
};

const saveFavoriteData = async (data: FavoriteData) => {
  const user = await getLoggedUser();

  if (!user) {
    return;
  }

  const key = getStorageKey(user.email);

  await AsyncStorage.setItem(
    key,
    JSON.stringify(data),
  );
};

export const getFavoriteTouristSpotIds = async () => {
  const data = await getFavoriteData();

  return data.touristSpots;
};

export const getFavoriteDestinationIds = async () => {
  const data = await getFavoriteData();

  return data.destinations;
};

export const isTouristSpotFavorite = async (
  touristSpotId: string,
) => {
  const data = await getFavoriteData();

  return data.touristSpots.includes(touristSpotId);
};

export const toggleFavoriteTouristSpot = async (
  touristSpotId: string,
) => {
  const user = await getLoggedUser();

  if (!user) {
    return null;
  }

  const data = await getFavoriteData();

  const index = data.touristSpots.indexOf(touristSpotId);

  if (index !== -1) {
    data.touristSpots.splice(index, 1);

    await saveFavoriteData(data);

    return false;
  }

  data.touristSpots.push(touristSpotId);

  await saveFavoriteData(data);

  return true;
};

export const isDestinationFavorite = async (
  destinationId: string,
) => {
  const data = await getFavoriteData();

  return data.destinations.includes(destinationId);
};

export const toggleFavoriteDestination = async (
  destinationId: string,
) => {
  const user = await getLoggedUser();

  if (!user) {
    return null;
  }

  const data = await getFavoriteData();

  const index = data.destinations.indexOf(destinationId);

  if (index !== -1) {
    data.destinations.splice(index, 1);

    await saveFavoriteData(data);

    return false;
  }

  data.destinations.push(destinationId);

  await saveFavoriteData(data);

  return true;
};