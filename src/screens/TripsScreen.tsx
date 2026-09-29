import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Plus,
  X,
} from "lucide-react-native";

import { RootStackParamList } from "../types/navigation";
import { createTrip, getTrips } from "../data/trips";
import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";
import { getLoggedUser } from "../data/auth";
import { Trip } from "../types/trip";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function TripsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<any>(null);
  const [tripList, setTripList] = useState<Trip[]>([]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [newTripName, setNewTripName] = useState("");
  const [newTripDestinationId, setNewTripDestinationId] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState("");
  const [newTripEndDate, setNewTripEndDate] = useState("");

  const loadTrips = async () => {
    const loggedUser = await getLoggedUser();

    setUser(loggedUser);

    if (!loggedUser) {
      setTripList([]);
      return;
    }

    const storedTrips = await getTrips();

    setTripList(storedTrips);
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, []),
  );

  const formatInputDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  };

  const openCreateTrip = () => {
    if (!user) {
      Alert.alert(
        "Entre para criar uma viagem",
        "Crie uma conta ou entre para começar a organizar suas viagens.",
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

    setIsCreateModalVisible(true);
  };

  const createNewTrip = async () => {
    if (
      !newTripName.trim() ||
      !newTripDestinationId ||
      newTripStartDate.length !== 10 ||
      newTripEndDate.length !== 10
    ) {
      Alert.alert(
        "Preencha os dados",
        "Informe o nome, destino e período da viagem.",
      );

      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      name: newTripName.trim(),
      destinationId: newTripDestinationId,
      startDate: newTripStartDate,
      endDate: newTripEndDate,
      items: [],
    };

    await createTrip(newTrip);

    setNewTripName("");
    setNewTripDestinationId("");
    setNewTripStartDate("");
    setNewTripEndDate("");

    setIsCreateModalVisible(false);

    navigation.navigate("TripDetails", {
      tripId: newTrip.id,
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Viagens</Text>

        {!user ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Organize suas viagens</Text>

            <Text style={styles.emptyText}>
              Crie uma conta ou faça login para criar e salvar suas viagens.
            </Text>

            <TouchableOpacity
              style={styles.createTripButton}
              onPress={() =>
                navigation.navigate("Auth", {
                  mode: "register",
                })
              }
            >
              <Text style={styles.createTripButtonText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() =>
                navigation.navigate("Auth", {
                  mode: "login",
                })
              }
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        ) : tripList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Você ainda não tem nenhuma viagem
            </Text>

            <Text style={styles.emptyText}>
              Crie sua primeira viagem e comece a organizar seu roteiro.
            </Text>

            <TouchableOpacity
              style={styles.createTripButton}
              onPress={openCreateTrip}
            >
              <View style={styles.createTripButtonContent}>
                <Text style={styles.createTripButtonText}>Criar viagem</Text>

                <View style={styles.createTripIcon}>
                  <Plus size={18} color={colors.white} strokeWidth={2} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.createTripButton}
              onPress={openCreateTrip}
            >
              <View style={styles.createTripButtonContent}>
                <Text style={styles.createTripButtonText}>Criar viagem</Text>

                <View style={styles.createTripIcon}>
                  <Plus size={18} color={colors.white} strokeWidth={2} />
                </View>
              </View>
            </TouchableOpacity>

            {tripList.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                style={styles.tripCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("TripDetails", {
                    tripId: trip.id,
                  })
                }
              >
                <Text style={styles.tripName}>{trip.name}</Text>

                <View style={styles.tripDateRow}>
                  <CalendarDays
                    size={16}
                    color={colors.textSecondary}
                    strokeWidth={1.8}
                  />

                  <Text style={styles.tripDates}>
                    {trip.startDate} — {trip.endDate}
                  </Text>
                </View>

                {trip.items.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nenhum ponto turístico adicionado.
                  </Text>
                ) : (
                  <View style={styles.items}>
                    {trip.items.map((item) => {
                      const touristSpot = touristSpots.find(
                        (spot) => spot.id === item.touristSpotId,
                      );

                      if (!touristSpot) {
                        return null;
                      }

                      return (
                        <View key={item.id} style={styles.item}>
                          <Image
                            source={touristSpot.image}
                            style={styles.image}
                          />

                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>
                              {touristSpot.name}
                            </Text>

                            <View style={styles.itemLocationRow}>
                              <MapPin
                                size={14}
                                color={colors.textSecondary}
                                strokeWidth={1.8}
                              />

                              <Text style={styles.itemLocation}>
                                {touristSpot.location}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Criar viagem</Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsCreateModalVisible(false)}
              >
                <X size={20} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nome da viagem</Text>

            <TextInput
              style={styles.tripInput}
              placeholder="Ex.: Férias em Bali"
              value={newTripName}
              onChangeText={setNewTripName}
            />

            <Text style={styles.inputLabel}>Destino</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationOptions}
            >
              {destinations.map((destination) => {
                const selected = newTripDestinationId === destination.id;

                return (
                  <TouchableOpacity
                    key={destination.id}
                    style={[
                      styles.destinationOption,
                      selected && styles.destinationOptionSelected,
                    ]}
                    onPress={() => setNewTripDestinationId(destination.id)}
                  >
                    <Text
                      style={[
                        styles.destinationOptionText,
                        selected && styles.destinationOptionTextSelected,
                      ]}
                    >
                      {destination.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.inputLabel}>Data de início</Text>

            <TextInput
              style={styles.tripInput}
              placeholder="DD/MM/AAAA"
              value={newTripStartDate}
              onChangeText={(value) =>
                setNewTripStartDate(formatInputDate(value))
              }
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.inputLabel}>Data de fim</Text>

            <TextInput
              style={styles.tripInput}
              placeholder="DD/MM/AAAA"
              value={newTripEndDate}
              onChangeText={(value) =>
                setNewTripEndDate(formatInputDate(value))
              }
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity style={styles.saveButton} onPress={createNewTrip}>
              <Text style={styles.saveButtonText}>Criar viagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsCreateModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
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
    height: "100%",
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 68,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: 24,
    paddingVertical: 5,
  },

  emptyContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingTop: "50%",
  },

  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },

  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 28,
  },

  createTripButton: {
    minHeight: 58,
    width: "100%",
    paddingLeft: 0,
    paddingRight: 6,
    paddingVertical: 10,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  createTripButtonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },

  createTripButtonText: {
    ...typography.button,
    color: colors.white,
    textTransform: "uppercase",
    paddingBottom: 5,
  },

  createTripIcon: {
    alignItems: "center",
    justifyContent: "center",
  },

  loginButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },

  loginButtonText: {
    ...typography.button,
    color: colors.primary,
    textTransform: "uppercase",
  },

  tripCard: {
    marginTop: 26,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  tripName: {
    ...typography.h2,
    color: colors.text,
  },

  tripDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 7,
  },

  tripDates: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  items: {
    marginTop: 18,
    gap: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 76,
    height: 76,
    borderRadius: 16,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    ...typography.h3,
    fontSize: 18,
    lineHeight: 28,
    color: colors.text,
  },

  itemLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },

  itemLocation: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },

  modalOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,

    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(35, 35, 35, 0.35)",
  },

  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },

  modalCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  inputLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 7,
  },

  tripInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 0,
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surface,
  },

  destinationOptions: {
    gap: 8,
    paddingVertical: 4,
  },

  destinationOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 60,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: colors.surface,
  },

  destinationOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  destinationOptionText: {
    ...typography.caption,
    fontSize: 14,
    color: colors.text,
    paddingBottom: 5,
  },

  destinationOptionTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },

  saveButton: {
    height: 52,
    marginTop: 22,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },

  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
  },

  cancelText: {
    ...typography.button,
    color: colors.textSecondary,
  },
});
