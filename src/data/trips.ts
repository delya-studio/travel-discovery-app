import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoggedUser } from "./auth";
import { Trip } from "../types/trip";

const getStorageKey = (email: string) => {
  return `@tryple_trips_${email}`;
};

export const getTrips = async (): Promise<Trip[]> => {
  const user = await getLoggedUser();

  if (!user) {
    return [];
  }

  const key = getStorageKey(user.email);
  const storedTrips = await AsyncStorage.getItem(key);

  if (!storedTrips) {
    return [];
  }

  return JSON.parse(storedTrips);
};

const saveTrips = async (tripList: Trip[]) => {
  const user = await getLoggedUser();

  if (!user) {
    return;
  }

  const key = getStorageKey(user.email);

  await AsyncStorage.setItem(key, JSON.stringify(tripList));
};

export const createTrip = async (trip: Trip) => {
  const currentTrips = await getTrips();

  currentTrips.push(trip);

  await saveTrips(currentTrips);
};

export const updateTrip = async (updatedTrip: Trip) => {
  const currentTrips = await getTrips();

  const index = currentTrips.findIndex((trip) => trip.id === updatedTrip.id);

  if (index === -1) {
    return;
  }

  currentTrips[index] = updatedTrip;

  await saveTrips(currentTrips);
};

export const deleteTrip = async (tripId: string) => {
  const currentTrips = await getTrips();

  const updatedTrips = currentTrips.filter((trip) => trip.id !== tripId);

  await saveTrips(updatedTrips);
};
