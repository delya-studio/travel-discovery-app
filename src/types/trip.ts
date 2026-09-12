export type TripItem = {
  id: string;
  touristSpotId: string;
  date?: string;
};

export type Trip = {
  id: string;
  name: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  items: TripItem[];
};
