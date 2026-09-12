import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  isTouristSpotFavorite,
  toggleFavoriteTouristSpot,
} from "../data/favorites";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAvoidingView, Platform } from "react-native";

import { RootStackParamList } from "../types/navigation";
import { touristSpots } from "../data/touristSpots";
import { destinations } from "../data/destinations";
import { trips } from "../data/trips";

type touristSpotRouteProp = RouteProp<RootStackParamList, "TouristSpot">;

export default function TouristSpotScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<touristSpotRouteProp>();

  const { touristSpotId } = route.params;

  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  const [newTripName, setNewTripName] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState("");
  const [newTripEndDate, setNewTripEndDate] = useState("");

  const touristSpot = touristSpots.find((spot) => spot.id === touristSpotId);

  const [isFavorite, setIsFavorite] = useState(
    isTouristSpotFavorite(touristSpotId),
  );

  if (!touristSpot) {
    return (
      <View style={styles.errorContainer}>
        <Text>Ponto turístico não encontrado.</Text>
      </View>
    );
  }

  const destination = destinations.find(
    (item) => item.id === touristSpot.destinationId,
  );

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: touristSpot.image }}
            style={styles.touristSpotImage}
          ></Image>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{touristSpot.name}</Text>

          <View style={styles.locationContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Destination", {
                  destinationId: touristSpot.destinationId,
                })
              }
            >
              <Text style={styles.locationLink}>{destination?.name}</Text>
            </TouchableOpacity>

            <Text style={styles.locationSeparator}> — </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Main", {
                  screen: "Explorar",
                  params: {
                    country: destination?.country,
                  },
                })
              }
            >
              <Text style={styles.locationLink}>{destination?.country}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{touristSpot.description}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>{touristSpot.category}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>{touristSpot.openingHours}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Entrada</Text>
              <Text style={styles.infoValue}>{touristSpot.price}</Text>
            </View>
          </View>

          {touristSpot.gallery.length > 0 && (
            <>
              <Text style={styles.galleryTitle}>Fotos</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.gallery}
              >
                {touristSpot.gallery.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            </>
          )}

          <View style={styles.weatherContainer}>
            <Text style={styles.weatherTitle}>Clima Atual</Text>

            <Text style={styles.temperature}>
              {touristSpot.weather.temperature}°C
            </Text>

            <Text style={styles.weatherCondition}>
              {touristSpot.weather.condition}
            </Text>

            <Text style={styles.humidity}>
              Umidade {touristSpot.weather.humidity}%
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToTripButton}
          onPress={() => setIsTripModalVisible(true)}
        >
          <Text style={styles.addToTripText}>+ Adicionar à viagem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => {
            const newValue = toggleFavoriteTouristSpot(touristSpot.id);

            setIsFavorite(newValue);
          }}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isTripModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsTripModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isCreatingTrip ? "Criar nova viagem" : "Adicionar à viagem"}
            </Text>

            {isCreatingTrip ? (
              <>
                <TextInput
                  style={styles.tripInput}
                  placeholder="Nome da viagem"
                  value={newTripName}
                  onChangeText={setNewTripName}
                />

                <TextInput
                  style={styles.tripInput}
                  placeholder="Data de início (DD/MM/AAAA)"
                  value={newTripStartDate}
                  onChangeText={(value) =>
                    setNewTripStartDate(formatDate(value))
                  }
                  keyboardType="numeric"
                  maxLength={10}
                />

                <TextInput
                  style={styles.tripInput}
                  placeholder="Data de término (DD/MM/AAAA)"
                  value={newTripEndDate}
                  onChangeText={(value) => setNewTripEndDate(formatDate(value))}
                  keyboardType="numeric"
                  maxLength={10}
                />

                <TouchableOpacity
                  style={styles.createTripButton}
                  onPress={() => {
                    const name = newTripName.trim();

                    if (!name || !newTripStartDate || !newTripEndDate) {
                      return;
                    }

                    const newTrip = {
                      id: Date.now().toString(),
                      name,
                      destinationId: touristSpot.destinationId,
                      startDate: newTripStartDate,
                      endDate: newTripEndDate,
                      items: [
                        {
                          id: Date.now().toString(),
                          touristSpotId: touristSpot.id,
                        },
                      ],
                    };

                    trips.push(newTrip);

                    setNewTripName("");
                    setNewTripStartDate("");
                    setNewTripEndDate("");
                    setIsCreatingTrip(false);
                    setIsTripModalVisible(false);
                  }}
                >
                  <Text style={styles.createTripText}>Criar viagem</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setNewTripName("");
                    setNewTripStartDate("");
                    setNewTripEndDate("");
                    setIsCreatingTrip(false);
                  }}
                >
                  <Text style={styles.cancelText}>Voltar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {trips.map((trip) => {
                  const alreadyAdded = trip.items.some(
                    (item) => item.touristSpotId === touristSpot.id,
                  );

                  return (
                    <TouchableOpacity
                      key={trip.id}
                      style={styles.tripOption}
                      disabled={alreadyAdded}
                      onPress={() => {
                        if (!alreadyAdded) {
                          trip.items.push({
                            id: Date.now().toString(),
                            touristSpotId: touristSpot.id,
                          });
                        }

                        setIsTripModalVisible(false);
                      }}
                    >
                      <Text style={styles.tripOptionName}>{trip.name}</Text>

                      <Text style={styles.tripOptionStatus}>
                        {alreadyAdded
                          ? "Já adicionado"
                          : `${trip.items.length} ponto${trip.items.length === 1 ? "" : "s"}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={styles.newTripOption}
                  onPress={() => setIsCreatingTrip(true)}
                >
                  <Text style={styles.newTripText}>+ Criar nova viagem</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsTripModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(197, 197, 197, 0.1)",

    opacity: 1,
    zIndex: 10,
  },

  favoriteButton: {
    width: 62,
    height: 62,
    borderRadius: 40,
    backgroundColor: "#C5C5C5",
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteIcon: {
    fontSize: 25,
  },

  addToTripButton: {
    flex: 1,
    height: 62,
    borderRadius: 40,
    backgroundColor: "#C5C5C5",
    alignItems: "center",
    justifyContent: "center",
  },

  addToTripText: {
    fontSize: 16,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },

  imageContainer: {
    height: 280,
    position: "relative",
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

  touristSpotImage: {
    flex: 1,
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  content: {
    padding: 20,
  },

  title: {
    marginTop: 40,
    fontSize: 28,
    fontWeight: "700",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  locationLink: {
    fontSize: 16,
  },

  locationSeparator: {
    fontSize: 16,
  },

  location: {
    marginTop: 8,
    fontSize: 16,
    color: "#666666",
  },

  description: {
    marginTop: 24,
    fontSize: 16,
    lineHeight: 24,
  },

  infoContainer: {
    marginTop: 24,
    gap: 14,
  },

  infoItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },

  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },

  galleryTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
  },

  gallery: {
    gap: 12,
  },

  galleryImage: {
    width: 220,
    height: 150,
    borderRadius: 16,
  },

  weatherContainer: {
    marginTop: 28,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
  },

  weatherTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  temperature: {
    marginTop: 12,
    fontSize: 32,
    fontWeight: "700",
  },

  weatherCondition: {
    marginTop: 4,
    fontSize: 16,
  },

  humidity: {
    marginTop: 8,
    fontSize: 14,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  tripOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  tripOptionName: {
    fontSize: 17,
    fontWeight: "600",
  },

  tripOptionStatus: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
  },

  newTripOption: {
    marginTop: 16,
    paddingVertical: 16,
  },

  newTripText: {
    fontSize: 16,
    fontWeight: "700",
  },

  tripInput: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },

  createTripButton: {
    height: 52,
    marginTop: 14,
    borderRadius: 26,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  createTripText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    height: 48,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
