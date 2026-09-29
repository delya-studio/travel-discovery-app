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

import { ArrowLeft, Search, X } from "lucide-react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

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
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={19} color={colors.text} strokeWidth={1.9} />

          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Pontos turísticos</Text>

          <Text style={styles.destinationName}>{destination.name}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={19} color={colors.textSecondary} strokeWidth={1.9} />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar local"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              activeOpacity={0.7}
              onPress={() => setSearch("")}
            >
              <X size={21} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

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
              activeOpacity={0.85}
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
              <View style={styles.emptyIcon}>
                <Search size={22} color={colors.primary} strokeWidth={1.8} />
              </View>

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
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    marginBottom: 40,
  },

  backText: {
    ...typography.bodySmall,

    color: colors.text,
  },

  header: {
    marginBottom: 24,
    paddingHorizontal: 2,
  },

  title: {
    ...typography.h1,

    fontSize: 34,
    lineHeight: 40,

    color: colors.text,
  },

  destinationName: {
    ...typography.body,
    textTransform: "uppercase",
    color: colors.textSecondary,

    marginTop: 14,
  },

  searchContainer: {
    height: 54,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,

    borderRadius: 60,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 10,

    ...typography.bodySmall,

    color: colors.text,
  },

  clearButton: {
    width: 28,
    height: 28,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.border,
  },

  resultText: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 18,
    marginBottom: 22,
    paddingHorizontal: 2,
  },

  list: {
    gap: 14,
  },

  card: {
    overflow: "hidden",

    borderRadius: 22,

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

  cardContent: {
    padding: 18,
  },

  name: {
    ...typography.h3,

    fontSize: 22,
    lineHeight: 27,

    color: colors.text,

    marginBottom: 5,
  },

  category: {
    ...typography.caption,

    color: colors.primary,

    fontWeight: "600",

    marginBottom: 14,
  },

  description: {
    ...typography.bodySmall,

    color: colors.textSecondary,

    lineHeight: 20,
  },

  empty: {
    alignItems: "center",

    paddingHorizontal: 30,
    paddingVertical: 50,
  },

  emptyIcon: {
    width: 48,
    height: 48,

    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,

    marginBottom: 14,
  },

  emptyTitle: {
    ...typography.h3,

    fontSize: 19,
    lineHeight: 25,

    color: colors.text,

    textAlign: "center",

    marginBottom: 7,
  },

  emptyText: {
    ...typography.bodySmall,

    color: colors.textSecondary,

    textAlign: "center",

    lineHeight: 20,
  },

  errorContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.background,
  },

  errorText: {
    ...typography.bodySmall,

    color: colors.textSecondary,
  },
});
