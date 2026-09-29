import React, { useState, useEffect } from "react";

import {
  Modal,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CloudRain,
  Droplets,
  Heart,
  MapPin,
  AlertCircle,
  X,
} from "lucide-react-native";

import {
  isDestinationFavorite,
  toggleFavoriteDestination,
} from "../data/favorites";

import type { RootStackParamList } from "../types/navigation";

import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";
import { getCurrentWeather } from "../services/weather";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

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

  const [currentWeather, setCurrentWeather] = useState<{
    temperature: number;
    humidity: number;
    condition: string;
    precipitation: number;
    time: string;
  } | null>(null);

  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      if (!destination) {
        return;
      }

      try {
        setIsLoadingWeather(true);

        const weather = await getCurrentWeather(
          destination.latitude,
          destination.longitude,
        );

        setCurrentWeather(weather);
      } catch (error) {
        console.error("Erro ao carregar clima:", error);
        setCurrentWeather(null);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    loadWeather();
  }, [destination]);

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
      setLoginModalVisible(true);
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
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* IMAGEM DO DESTINO */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={21} color={colors.text} strokeWidth={1.9} />
          </TouchableOpacity>

          <Image
            source={{ uri: destination.image }}
            style={styles.destinationImage}
          ></Image>

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

        {/* INFORMAÇÕES PRINCIPAIS */}
        <View style={styles.content}>
          <Text style={styles.title}>{destination.name}</Text>

          <View style={styles.locationRow}>
            <MapPin size={15} color={colors.textSecondary} strokeWidth={1.8} />

            <Text style={styles.country}>{destination.country}</Text>
          </View>

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
                  style={styles.seeMoreButton}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("TouristSpots", {
                      destinationId: destination.id,
                    })
                  }
                >
                  <Text style={styles.seeMoreText}>Ver todos</Text>

                  <ArrowRight
                    size={17}
                    color={colors.primary}
                    strokeWidth={1.9}
                  />
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
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("TouristSpot", {
                          touristSpotId: spot.id,
                        })
                      }
                    >
                      <ArrowUpRight
                        size={18}
                        color={colors.white}
                        strokeWidth={1.9}
                      />
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
              <Text style={styles.sectionTitle}>Clima atual</Text>

              <View style={styles.climateCard}>
                {isLoadingWeather ? (
                  <Text style={styles.weatherStatus}>Carregando clima...</Text>
                ) : currentWeather ? (
                  <>
                    <Text style={styles.temperature}>
                      {Math.round(currentWeather.temperature)}°C
                    </Text>

                    <Text style={styles.condition}>
                      {currentWeather.condition}
                    </Text>

                    <Text style={styles.humidity}>
                      Umidade: {currentWeather.humidity}%
                    </Text>

                    <Text style={styles.precipitation}>
                      Chuva: {currentWeather.precipitation} mm
                    </Text>

                    <Text style={styles.weatherUpdated}>
                      Atualizado às{" "}
                      {new Date(currentWeather.time).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.weatherStatus}>
                    Não foi possível carregar o clima.
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={loginModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <View style={styles.loginModalOverlay}>
          <View style={styles.loginModal}>
            <View style={styles.loginModalHeader}>
              <View style={styles.loginModalIcon}>
                <AlertCircle size={22} color={colors.primary} strokeWidth={2} />
              </View>

              <TouchableOpacity
                style={styles.loginModalClose}
                activeOpacity={0.7}
                onPress={() => setLoginModalVisible(false)}
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            <Text style={styles.loginModalTitle}>Entre para salvar</Text>

            <Text style={styles.loginModalMessage}>
              Você precisa estar logado para salvar destinos.
            </Text>

            <TouchableOpacity
              style={styles.loginModalPrimaryButton}
              activeOpacity={0.8}
              onPress={() => {
                setLoginModalVisible(false);
                navigation.navigate("Auth", { mode: "login" });
              }}
            >
              <Text style={styles.loginModalPrimaryButtonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginModalSecondaryButton}
              activeOpacity={0.8}
              onPress={() => {
                setLoginModalVisible(false);
                navigation.navigate("Auth", { mode: "register" });
              }}
            >
              <Text style={styles.loginModalSecondaryButtonText}>
                Criar conta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginModalCancelButton}
              activeOpacity={0.7}
              onPress={() => setLoginModalVisible(false)}
            >
              <Text style={styles.loginModalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  imageContainer: {
    height: 330,
    position: "relative",
  },

  destinationImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    position: "absolute",
    top: 58,
    left: 20,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(242, 240, 233, 0.88)",
  },

  favoriteButton: {
    position: "absolute",
    right: 22,
    bottom: -25,
    zIndex: 2,
    width: 58,
    height: 58,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    ...typography.h1,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 3,
    marginTop: 28,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },

  country: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -5,
  },

  descriptionSection: {
    marginTop: 28,
  },

  sectionTitle: {
    ...typography.h3,
    fontSize: 22,

    lineHeight: 26,
    color: colors.text,
  },

  description: {
    ...typography.bodySmall,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 9,
  },

  filtersContainer: {
    marginTop: 28,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },

  filter: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    ...typography.bodySmall,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  activeFilterText: {
    color: colors.white,
  },

  section: {
    marginTop: 32,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  seeMoreText: {
    ...typography.caption,
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginTop: -6,
  },

  touristCard: {
    width: 280,
    height: 270,
    marginRight: 12,
    padding: 6,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  touristSpotImage: {
    width: "100%",
    height: 145,
    borderRadius: 17,
  },

  touristSpotName: {
    ...typography.h3,
    fontSize: 18,
    lineHeight: 23,
    color: colors.text,
    marginTop: 13,
    paddingHorizontal: 7,
    paddingRight: 50,
  },

  touristSpotLocation: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    paddingHorizontal: 7,
    paddingRight: 50,
  },

  touristSpotButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  bestTime: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 10,
  },

  climateCard: {
    minHeight: 170,
    marginTop: 12,
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },

  weatherStatus: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  temperature: {
    ...typography.display,
    fontSize: 42,
    lineHeight: 48,
    color: colors.text,
  },

  condition: {
    ...typography.body,
    color: colors.text,
    marginTop: 2,
  },

  humidity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 12,
  },

  precipitation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },

  weatherUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 12,
  },

  loginModalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  loginModal: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 26,
    backgroundColor: colors.background,
  },

  loginModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  loginModalIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  loginModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  loginModalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },

  loginModalMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 22,
  },

  loginModalPrimaryButton: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  loginModalPrimaryButtonText: {
    ...typography.button,
    color: colors.white,
  },

  loginModalSecondaryButton: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    marginTop: 10,
  },

  loginModalSecondaryButtonText: {
    ...typography.button,
    color: colors.primary,
  },

  loginModalCancelButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  loginModalCancelText: {
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
