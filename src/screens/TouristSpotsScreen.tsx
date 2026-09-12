import React, { useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";

type TouristSpotsRouteProp = RouteProp<RootStackParamList, "TouristSpots">;

export default function TouristSpotsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<TouristSpotsRouteProp>();

  const { destinationId } = route.params;

  const [search, setSearch] = useState("");

  const destination = destinations.find((item) => item.id === destinationId);

  const destinationSpots = touristSpots.filter(
    (spot) => spot.destinationId === destinationId,
  );

  const query = search.trim().toLowerCase();

  const filteredSpots = destinationSpots.filter((spot) => {
    if (!query) {
      return true;
    }

    return (
      spot.name.toLowerCase().includes(query) ||
      spot.category.toLowerCase().includes(query) ||
      spot.location.toLowerCase().includes(query)
    );
  });

  if (!destination) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Destino não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Pontos turísticos</Text>

        <Text style={styles.destinationName}>{destination.name}</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar local"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.resultText}>
          {filteredSpots.length}{" "}
          {filteredSpots.length === 1
            ? "local encontrado"
            : "locais encontrados"}
        </Text>

        <View style={styles.list}>
          {filteredSpots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
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

                <Text style={styles.category}>{spot.category}</Text>

                <Text style={styles.description} numberOfLines={2}>
                  {spot.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {filteredSpots.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nenhum local encontrado</Text>

              <Text style={styles.emptyText}>
                Tente buscar por outro nome ou categoria.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },

  backText: {
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  destinationName: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },

  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },

  resultText: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 16,
  },

  list: {
    gap: 16,
  },

  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
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
    marginBottom: 5,
  },

  category: {
    fontSize: 14,
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    fontSize: 16,
  },
});
