import React, { useState, useEffect } from "react";

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
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Plus,
  X,
} from "lucide-react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { KeyboardAvoidingView, Platform } from "react-native";

import type { RootStackParamList } from "../types/navigation";

import { touristSpots } from "../data/touristSpots";
import { destinations } from "../data/destinations";
import { Trip } from "../types/trip";

import { getTrips, createTrip, updateTrip } from "../data/trips";

import { getLoggedUser } from "../data/auth";

import {
  isTouristSpotFavorite,
  toggleFavoriteTouristSpot,
} from "../data/favorites";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type touristSpotRouteProp = RouteProp<RootStackParamList, "TouristSpot">;

export default function TouristSpotScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<touristSpotRouteProp>();

  const { touristSpotId } = route.params;

  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);

  const [newTripName, setNewTripName] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState("");
  const [newTripEndDate, setNewTripEndDate] = useState("");

  const touristSpot = touristSpots.find((spot) => spot.id === touristSpotId);

  const [isFavorite, setIsFavorite] = useState(false);

  type AccessModal = {
    title: string;
    message: string;
  };

  const [accessModal, setAccessModal] = useState<AccessModal | null>(null);

  useEffect(() => {
    const loadFavorite = async () => {
      const favorite = await isTouristSpotFavorite(touristSpotId);

      setIsFavorite(favorite);
    };

    loadFavorite();
  }, [touristSpotId]);

  useEffect(() => {
    const loadTrips = async () => {
      const storedTrips = await getTrips();
      setUserTrips(storedTrips);
    };

    loadTrips();
  }, [isTripModalVisible]);

  const handleFavorite = async () => {
    const result = await toggleFavoriteTouristSpot(touristSpotId);

    if (result === null) {
      setAccessModal({
        title: "Entre para salvar",
        message:
          "Crie uma conta ou entre para salvar pontos turísticos nos seus favoritos.",
      });

      return;
    }

    setIsFavorite(result);
  };

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

  const handleAddToTrip = async () => {
    const user = await getLoggedUser();

    if (!user) {
      setAccessModal({
        title: "Entre para criar uma viagem",
        message:
          "Crie uma conta ou entre para adicionar pontos turísticos às suas viagens.",
      });

      return;
    }

    setIsTripModalVisible(true);
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
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={21} color={colors.text} strokeWidth={1.9} />
          </TouchableOpacity>

          <Image
            source={{ uri: touristSpot.image }}
            style={styles.touristSpotImage}
          ></Image>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{touristSpot.name}</Text>

          <View style={styles.locationContainer}>
            <MapPin size={15} color={colors.textSecondary} strokeWidth={1.8} />

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Destination", {
                  destinationId: touristSpot.destinationId,
                })
              }
            >
              <Text style={styles.locationLink}>{destination?.name}</Text>
            </TouchableOpacity>

            <Text style={styles.locationSeparator}>·</Text>

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
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToTripButton}
          activeOpacity={0.8}
          onPress={handleAddToTrip}
        >
          <Text style={styles.addToTripText}>Adicionar à viagem</Text>

          <View style={styles.addToTripIcon}>
            <Plus size={19} color={colors.white} strokeWidth={2.1} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.8}
          onPress={handleFavorite}
        >
          <Heart
            size={23}
            color={colors.primaryMedium}
            strokeWidth={1.8}
            fill={isFavorite ? colors.primaryMedium : "transparent"}
          />
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
                  onPress={async () => {
                    const name = newTripName.trim();

                    if (!name || !newTripStartDate || !newTripEndDate) {
                      return;
                    }

                    const newTrip: Trip = {
                      id: Date.now().toString(),
                      name,
                      destinationId: touristSpot.destinationId,
                      startDate: newTripStartDate,
                      endDate: newTripEndDate,
                      items: [
                        {
                          id: `${Date.now()}-${touristSpot.id}`,
                          touristSpotId: touristSpot.id,
                        },
                      ],
                    };

                    await createTrip(newTrip);

                    setUserTrips((currentTrips) => [...currentTrips, newTrip]);

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
                {userTrips.map((trip: Trip) => {
                  const alreadyAdded = trip.items.some(
                    (item) => item.touristSpotId === touristSpot.id,
                  );

                  return (
                    <TouchableOpacity
                      key={trip.id}
                      style={styles.tripOption}
                      disabled={alreadyAdded}
                      onPress={async () => {
                        if (alreadyAdded) {
                          return;
                        }

                        const updatedTrip: Trip = {
                          ...trip,
                          items: [
                            ...trip.items,
                            {
                              id: `${trip.id}-${touristSpot.id}-${Date.now()}`,
                              touristSpotId: touristSpot.id,
                            },
                          ],
                        };

                        await updateTrip(updatedTrip);

                        setUserTrips((currentTrips) =>
                          currentTrips.map((item) =>
                            item.id === updatedTrip.id ? updatedTrip : item,
                          ),
                        );

                        setIsTripModalVisible(false);
                      }}
                    >
                      <Text style={styles.tripOptionName}>{trip.name}</Text>

                      <Text style={styles.tripOptionStatus}>
                        {alreadyAdded
                          ? "Já adicionado"
                          : `${trip.items.length} ponto${
                              trip.items.length === 1 ? "" : "s"
                            }`}
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

      <Modal
        visible={accessModal !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setAccessModal(null)}
      >
        <View style={styles.accessModalOverlay}>
          <View style={styles.accessModal}>
            <View style={styles.accessModalHeader}>
              <View style={styles.accessModalIcon}>
                <AlertCircle size={22} color={colors.primary} strokeWidth={2} />
              </View>

              <TouchableOpacity
                style={styles.accessModalClose}
                activeOpacity={0.7}
                onPress={() => setAccessModal(null)}
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            <Text style={styles.accessModalTitle}>{accessModal?.title}</Text>

            <Text style={styles.accessModalMessage}>
              {accessModal?.message}
            </Text>

            <TouchableOpacity
              style={styles.accessModalPrimaryButton}
              activeOpacity={0.8}
              onPress={() => {
                setAccessModal(null);
                navigation.navigate("Auth", {
                  mode: "login",
                });
              }}
            >
              <Text style={styles.accessModalPrimaryText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accessModalSecondaryButton}
              activeOpacity={0.8}
              onPress={() => {
                setAccessModal(null);
                navigation.navigate("Auth", {
                  mode: "register",
                });
              }}
            >
              <Text style={styles.accessModalSecondaryText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accessModalCancel}
              activeOpacity={0.7}
              onPress={() => setAccessModal(null)}
            >
              <Text style={styles.accessModalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 110,
  },

  // IMAGEM

  imageContainer: {
    height: 330,
    position: "relative",
  },

  touristSpotImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    position: "absolute",
    top: 58,
    left: 20,
    zIndex: 3,

    width: 48,
    height: 48,
    borderRadius: 60,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(242, 240, 233, 0.9)",
  },

  // CONTEÚDO

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    ...typography.h1,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 4,
    marginTop: 28,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 6,
    gap: 5,
  },

  locationLink: {
    ...typography.body,
    color: colors.primaryMedium,
    fontWeight: "600",
    marginTop: -4,
  },

  locationSeparator: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -4,
  },

  description: {
    ...typography.bodySmall,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,

    marginTop: 26,
  },

  // INFORMAÇÕES

  infoContainer: {
    flexDirection: "row",
    gap: 8,

    marginTop: 28,
  },

  infoItem: {
    flex: 1,

    minHeight: 92,

    padding: 14,

    borderRadius: 18,

    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,

    justifyContent: "center",
  },

  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,

    marginBottom: 5,
  },

  infoValue: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.text,

    lineHeight: 20,
  },

  // GALERIA

  galleryTitle: {
    ...typography.h3,
    fontSize: 20,
    lineHeight: 26,

    color: colors.text,

    marginTop: 34,
    marginBottom: 14,
  },

  gallery: {
    gap: 10,
  },

  galleryImage: {
    width: 220,
    height: 145,

    borderRadius: 20,
  },

  // BARRA INFERIOR

  bottomBar: {
    position: "absolute",

    left: 20,
    right: 20,
    bottom: 24,

    height: 66,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    zIndex: 10,
  },

  addToTripButton: {
    flex: 1,

    height: 58,

    paddingLeft: 20,
    paddingRight: 7,

    borderRadius: 60,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,
  },

  addToTripText: {
    ...typography.button,
    color: colors.white,
    marginTop: -5,
  },

  addToTripIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",
  },

  favoriteButton: {
    width: 58,
    height: 58,

    borderRadius: 29,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,

    borderWidth: 1,
    borderColor: colors.border,
  },

  // MODAL DE ACESSO

  accessModalOverlay: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,

    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  accessModal: {
    width: "100%",
    maxWidth: 360,

    padding: 24,

    borderRadius: 26,

    backgroundColor: colors.background,
  },

  accessModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 20,
  },

  accessModalIcon: {
    width: 46,
    height: 46,

    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,
  },

  accessModalClose: {
    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surface,
  },

  accessModalTitle: {
    ...typography.h2,

    color: colors.text,

    marginBottom: 8,
  },

  accessModalMessage: {
    ...typography.bodySmall,

    color: colors.textSecondary,
    lineHeight: 21,

    marginBottom: 22,
  },

  accessModalPrimaryButton: {
    height: 50,

    borderRadius: 25,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,
  },

  accessModalPrimaryText: {
    ...typography.button,
    color: colors.white,
  },

  accessModalSecondaryButton: {
    height: 50,

    borderRadius: 25,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,

    marginTop: 10,
  },

  accessModalSecondaryText: {
    ...typography.button,
    color: colors.primary,
  },

  accessModalCancel: {
    height: 44,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 6,
  },

  accessModalCancelText: {
    ...typography.bodySmall,

    color: colors.textSecondary,
    fontWeight: "600",
  },

  // MODAL DE VIAGEM

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  modalContainer: {
    maxHeight: "85%",

    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 34,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    backgroundColor: colors.background,
  },

  modalTitle: {
    ...typography.h2,

    color: colors.text,

    marginBottom: 20,
  },

  tripOption: {
    paddingVertical: 15,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tripOptionName: {
    ...typography.body,

    fontWeight: "600",
    color: colors.text,
  },

  tripOptionStatus: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 4,
  },

  newTripOption: {
    marginTop: 14,
    paddingVertical: 15,

    flexDirection: "row",
    alignItems: "center",
  },

  newTripText: {
    ...typography.button,

    color: colors.primary,
  },

  tripInput: {
    height: 54,

    paddingHorizontal: 16,

    borderRadius: 16,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    ...typography.bodySmall,

    color: colors.text,

    marginBottom: 12,
  },

  createTripButton: {
    height: 52,

    marginTop: 10,

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,
  },

  createTripText: {
    ...typography.button,

    color: colors.white,
  },

  cancelButton: {
    height: 46,

    marginTop: 6,

    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    ...typography.bodySmall,

    color: colors.textSecondary,

    fontWeight: "600",
  },

  errorContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.background,
  },
});
