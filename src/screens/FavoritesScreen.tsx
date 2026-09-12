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

import { RootStackParamList } from "../types/navigation";

import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";

import {
  favoriteDestinationIds,
  favoriteTouristSpotIds,
} from "../data/favorites";

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [, setRefresh] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefresh((value) => value + 1);
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
                    onPress={() =>
                      navigation.navigate("Destination", {
                        destinationId: destination.id,
                      })
                    }
                  >
                    <Image
                      source={{ uri: destination.image }}
                      style={styles.image}
                    />

                    <View style={styles.cardContent}>
                      <Text style={styles.name}>{destination.name}</Text>

                      <Text style={styles.location}>{destination.country}</Text>

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
                    onPress={() =>
                      navigation.navigate("TouristSpot", {
                        touristSpotId: spot.id,
                      })
                    }
                  >
                    <Image source={{ uri: spot.image }} style={styles.image} />

                    <View style={styles.cardContent}>
                      <Text style={styles.name}>{spot.name}</Text>

                      <Text style={styles.location}>{spot.location}</Text>

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
    backgroundColor: "#EDEDED",
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 16,
  },

  name: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 4,
  },

  location: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555555",
  },

  empty: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#666666",
  },
});
