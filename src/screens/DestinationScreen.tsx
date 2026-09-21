import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  isDestinationFavorite,
  toggleFavoriteDestination,
} from "../data/favorites";

import { RootStackParamList } from "../types/navigation";
import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";

type DestinationRouteProp = RouteProp<RootStackParamList, "Destination">;

export default function DestinationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<DestinationRouteProp>();

  const { destinationId } = route.params;
  const [activeSection, setActiveSection] = useState<
    "spots" | "bestTime" | "weather"
  >("spots");

  const destination = destinations.find((item) => item.id === destinationId);

  const destinationSpots = touristSpots.filter(
    (spot) => spot.destinationId === destinationId,
  );

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadFavorite = async () => {
      if (!destination) {
        return;
      }

      const favorite = await isDestinationFavorite(destination.id);

      setIsFavorite(favorite);
    };

    loadFavorite();
  }, [destination?.id]);

  const handleFavorite = async () => {
    if (!destination) {
      return;
    }

    const result = await toggleFavoriteDestination(destination.id);

    if (result === null) {
      Alert.alert(
        "Entre para salvar",
        "Crie uma conta ou entre para salvar destinos nos seus favoritos.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Entrar",
            onPress: () =>
              navigation.navigate("Auth", {
                mode: "login",
              }),
          },
          {
            text: "Criar conta",
            onPress: () =>
              navigation.navigate("Auth", {
                mode: "register",
              }),
          },
        ],
      );

      return;
    }

    setIsFavorite(result);
  };

  if (!destination) {
    return (
      <View style={styles.errorContainer}>
        <Text>Destino não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* IMAGEM DO DESTINO */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: destination.image }}
          style={styles.destinationImage}
        ></Image>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavorite}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      {/* INFORMAÇÕES PRINCIPAIS */}
      <View style={styles.content}>
        <Text style={styles.title}>{destination.name}</Text>

        <Text style={styles.country}>{destination.country}</Text>

        {/* DESCRIÇÃO */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descrição</Text>

          <Text style={styles.description}>{destination.description}</Text>
        </View>

        {/* FILTROS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <TouchableOpacity
            style={[
              styles.filter,
              activeSection === "spots" && styles.activeFilter,
            ]}
            onPress={() => setActiveSection("spots")}
          >
            <Text
              style={[
                styles.filterText,
                activeSection === "spots" && styles.activeFilterText,
              ]}
            >
              Pontos turísticos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filter,
              activeSection === "bestTime" && styles.activeFilter,
            ]}
            onPress={() => setActiveSection("bestTime")}
          >
            <Text
              style={[
                styles.filterText,
                activeSection === "bestTime" && styles.activeFilterText,
              ]}
            >
              Melhor época
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filter,
              activeSection === "weather" && styles.activeFilter,
            ]}
            onPress={() => setActiveSection("weather")}
          >
            <Text
              style={[
                styles.filterText,
                activeSection === "weather" && styles.activeFilterText,
              ]}
            >
              Clima
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {activeSection === "spots" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pontos turísticos</Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TouristSpots", {
                    destinationId: destination.id,
                  })
                }
              >
                <Text>Ver →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {destinationSpots.map((spot) => (
                <View key={spot.id} style={styles.touristCard}>
                  <Image
                    source={{ uri: spot.image }}
                    style={styles.touristSpotImage}
                  />

                  <Text style={styles.touristSpotName}>{spot.name}</Text>

                  <Text style={styles.touristSpotLocation}>
                    {spot.location}
                  </Text>

                  <TouchableOpacity
                    style={styles.touristSpotButton}
                    onPress={() =>
                      navigation.navigate("TouristSpot", {
                        touristSpotId: spot.id,
                      })
                    }
                  >
                    <Text style={styles.touristSpotArrow}>→</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeSection === "bestTime" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Melhor época</Text>

            <Text style={styles.bestTime}>{destination.bestTimeToVisit}</Text>
          </View>
        )}

        {activeSection === "weather" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clima</Text>

            <View style={styles.climateCard}>
              <Text>Informações sobre o clima</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },

  content: {
    padding: 20,
  },

  backButton: {
    position: "relative",
    left: 20,
    top: 60,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#aaa9a9ab",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  backIcon: {
    fontSize: 26,
  },

  imageContainer: {
    height: 280,
    position: "relative",
  },

  destinationImage: {
    flex: 1,
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  favoriteButton: {
    position: "absolute",
    right: 30,
    bottom: -25,
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteIcon: {
    fontSize: 26,
  },

  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "700",
  },

  country: {
    marginTop: 4,
    fontSize: 16,
    color: "#666666",
  },

  descriptionSection: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#555555",
  },

  filtersContainer: {
    marginTop: 28,
    marginHorizontal: -20,
  },

  filter: {
    marginLeft: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#DADADA",
  },

  activeFilter: {
    backgroundColor: "#222222",
  },

  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },
  section: {
    marginTop: 40,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  seeMore: {
    fontSize: 14,
    fontWeight: "600",
  },

  touristCard: {
    width: 281,
    height: 250,
    marginRight: 12,
    padding: 5,
    borderRadius: 12,
    backgroundColor: "#E8E8E8",
  },

  touristSpotImage: {
    width: "100%",
    height: 130,
    borderRadius: 10,
  },

  touristSpotInfo: {
    marginTop: 8,
  },

  touristSpotName: {
    marginTop: 24,
    paddingLeft: 8,
    fontSize: 16,
    fontWeight: "700",
  },

  touristSpotLocation: {
    marginTop: 4,
    paddingLeft: 12,
    fontSize: 13,
    color: "#666666",
  },

  touristSpotButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DADADA",
    alignItems: "center",
    justifyContent: "center",
  },

  touristSpotArrow: {
    fontSize: 22,
  },

  bestTime: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },

  climateCard: {
    height: 120,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
