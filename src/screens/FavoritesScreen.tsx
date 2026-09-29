import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Heart, MapPin } from "lucide-react-native";

import { RootStackParamList } from "../types/navigation";

import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";

import {
  getFavoriteDestinationIds,
  getFavoriteTouristSpotIds,
} from "../data/favorites";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [, setRefresh] = useState(0);

  const [favoriteDestinationIds, setFavoriteDestinationIds] = useState<
    string[]
  >([]);

  const [favoriteTouristSpotIds, setFavoriteTouristSpotIds] = useState<
    string[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const destinationIds = await getFavoriteDestinationIds();

        const touristSpotIds = await getFavoriteTouristSpotIds();

        setFavoriteDestinationIds(destinationIds);
        setFavoriteTouristSpotIds(touristSpotIds);
      };

      loadFavorites();
    }, []),
  );

  const favoriteDestinations = destinations.filter((destination) =>
    favoriteDestinationIds.includes(destination.id),
  );

  const favoriteSpots = touristSpots.filter((spot) =>
    favoriteTouristSpotIds.includes(spot.id),
  );

  const hasFavorites =
    favoriteDestinations.length > 0 || favoriteSpots.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {!hasFavorites ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Heart size={26} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>

            <Text style={styles.emptyText}>
              Toque no coração de um destino ou ponto turístico para adicioná-lo
              aos seus favoritos.
            </Text>
          </View>
        ) : (
          <>
            {favoriteDestinations.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Destinos</Text>

                {favoriteDestinations.map((destination) => (
                  <TouchableOpacity
                    key={`destination-${destination.id}`}
                    style={styles.card}
                    activeOpacity={0.88}
                    onPress={() =>
                      navigation.navigate("Destination", {
                        destinationId: destination.id,
                      })
                    }
                  >
                    <View>
                      <Image source={destination.image} style={styles.image} />

                      <View style={styles.favoriteIcon}>
                        <Heart
                          size={20}
                          color={colors.primaryMedium}
                          fill={colors.primaryMedium}
                          strokeWidth={1.8}
                        />
                      </View>
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.name}>{destination.name}</Text>

                      <View style={styles.locationRow}>
                        <MapPin
                          size={14}
                          color={colors.textSecondary}
                          strokeWidth={1.8}
                        />

                        <Text style={styles.location}>
                          {destination.country}
                        </Text>
                      </View>

                      <Text style={styles.description} numberOfLines={2}>
                        {destination.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {favoriteSpots.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Pontos turísticos</Text>

                {favoriteSpots.map((spot) => (
                  <TouchableOpacity
                    key={`spot-${spot.id}`}
                    style={styles.card}
                    activeOpacity={0.88}
                    onPress={() =>
                      navigation.navigate("TouristSpot", {
                        touristSpotId: spot.id,
                      })
                    }
                  >
                    <View>
                      <Image source={spot.image} style={styles.image} />

                      <View style={styles.favoriteIcon}>
                        <Heart
                          size={20}
                          color={colors.primaryMedium}
                          fill={colors.primaryMedium}
                          strokeWidth={1.8}
                        />
                      </View>
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.name}>{spot.name}</Text>

                      <View style={styles.locationRow}>
                        <MapPin
                          size={14}
                          color={colors.textSecondary}
                          strokeWidth={1.8}
                        />

                        <Text style={styles.location}>{spot.location}</Text>
                      </View>

                      <Text style={styles.description} numberOfLines={2}>
                        {spot.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 75,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: 5,
  },

  list: {
    paddingBottom: 30,
  },

  sectionTitle: {
    ...typography.body,
    fontSize: 18,
    paddingLeft: 3,
    textTransform: "uppercase",
    color: colors.textSecondary,
    paddingBottom: 30,
    marginTop: 34,
  },

  card: {
    marginBottom: 16,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  image: {
    width: "100%",
    height: 190,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  favoriteIcon: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 46,
    height: 46,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  cardContent: {
    padding: 16,
  },

  name: {
    ...typography.destination,
    color: colors.text,
    marginBottom: 5,
    lineHeight: 48,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 9,
  },

  location: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  empty: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: colors.primaryLight,
  },

  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },

  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
});
