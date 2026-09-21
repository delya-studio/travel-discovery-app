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

import { RootStackParamList } from "../types/navigation";
import { createTrip, getTrips } from "../data/trips";
import { destinations } from "../data/destinations";
import { touristSpots } from "../data/touristSpots";
import { getLoggedUser } from "../data/auth";

import { Trip } from "../types/trip";

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
              <Text style={styles.createTripButtonText}>+ Criar viagem</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.createTripButton}
              onPress={openCreateTrip}
            >
              <Text style={styles.createTripButtonText}>+ Criar viagem</Text>
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

                <Text style={styles.tripDates}>
                  {trip.startDate} — {trip.endDate}
                </Text>

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
                            source={{
                              uri: touristSpot.image,
                            }}
                            style={styles.image}
                          />

                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>
                              {touristSpot.name}
                            </Text>

                            <Text style={styles.itemLocation}>
                              {touristSpot.location}
                            </Text>
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
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Criar viagem</Text>

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
  },

  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },

  createTripButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#000000",
    alignItems: "center",
  },

  createTripButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  loginButton: {
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  loginButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
  },

  tripName: {
    fontSize: 22,
    fontWeight: "700",
  },

  tripDates: {
    marginTop: 6,
    fontSize: 14,
    color: "#666666",
  },

  items: {
    marginTop: 16,
    gap: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 17,
    fontWeight: "600",
  },

  itemLocation: {
    marginTop: 4,
    fontSize: 14,
    color: "#666666",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 30,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },

  tripInput: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
  },

  destinationOptions: {
    gap: 8,
    paddingVertical: 4,
  },

  destinationOption: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  destinationOptionSelected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },

  destinationOptionText: {
    fontSize: 14,
  },

  destinationOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  saveButton: {
    marginTop: 22,
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
