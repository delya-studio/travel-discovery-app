export const favoriteTouristSpotIds: string[] = [];

export const toggleFavoriteTouristSpot = (touristSpotId: string) => {
  const index = favoriteTouristSpotIds.indexOf(touristSpotId);

  if (index !== -1) {
    favoriteTouristSpotIds.splice(index, 1);
    return false;
  }

  favoriteTouristSpotIds.push(touristSpotId);
  return true;
};

export const isTouristSpotFavorite = (touristSpotId: string) => {
  return favoriteTouristSpotIds.includes(touristSpotId);
};

export const favoriteDestinationIds: string[] = [];

export const toggleFavoriteDestination = (destinationId: string) => {
  const index = favoriteDestinationIds.indexOf(destinationId);

  if (index !== -1) {
    favoriteDestinationIds.splice(index, 1);
    return false;
  }

  favoriteDestinationIds.push(destinationId);
  return true;
};

export const isDestinationFavorite = (destinationId: string) => {
  return favoriteDestinationIds.includes(destinationId);
};
