import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { trips } from "../data/trips";
import { touristSpots } from "../data/touristSpots";

type TripDetailsRouteProp = RouteProp<RootStackParamList, "TripDetails">;

const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);

  return new Date(year, month - 1, day);
};

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const generateTripDays = (startDate: string, endDate: string) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const days: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

export default function TripDetailsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<TripDetailsRouteProp>();

  const { tripId } = route.params;

  const trip = trips.find((item) => item.id === tripId);

  const [, setRefresh] = useState(0);

  const [selectedDay, setSelectedDay] = useState(0);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [isDayModalVisible, setIsDayModalVisible] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTripName, setEditTripName] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text>Viagem não encontrada.</Text>
      </View>
    );
  }

  const tripDays = generateTripDays(trip.startDate, trip.endDate);

  const currentDate = tripDays[selectedDay];

  const currentDayItems = trip.items.filter(
    (item) => item.date === currentDate,
  );

  const unplannedItems = trip.items.filter((item) => !item.date);

  const refresh = () => {
    setRefresh((value) => value + 1);
  };

  const addSpotToCurrentDay = (touristSpotId: string) => {
    const alreadyAdded = trip.items.some(
      (item) => item.touristSpotId === touristSpotId,
    );

    if (alreadyAdded) {
      return;
    }

    trip.items.push({
      id: Date.now().toString(),
      touristSpotId,
      date: currentDate,
    });

    setIsAddModalVisible(false);
    refresh();
  };

  const openDaySelector = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDayModalVisible(true);
  };

  const assignItemToDay = (date: string) => {
    const item = trip.items.find((tripItem) => tripItem.id === selectedItemId);

    if (item) {
      item.date = date;
    }

    setSelectedItemId(null);
    setIsDayModalVisible(false);

    refresh();
  };

  const removeItem = (itemId: string) => {
    trip.items = trip.items.filter((item) => item.id !== itemId);

    refresh();
  };

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

  const openEditModal = () => {
    setEditTripName(trip.name);
    setEditStartDate(trip.startDate);
    setEditEndDate(trip.endDate);
    setIsEditModalVisible(true);
  };

  const saveTripChanges = () => {
    if (
      !editTripName.trim() ||
      editStartDate.length !== 10 ||
      editEndDate.length !== 10
    ) {
      return;
    }

    trip.name = editTripName.trim();
    trip.startDate = editStartDate;
    trip.endDate = editEndDate;

    setIsEditModalVisible(false);
    setSelectedDay(0);
    refresh();
  };

  const deleteTrip = () => {
    Alert.alert(
      "Excluir viagem",
      `Tem certeza que deseja excluir "${trip.name}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const index = trips.findIndex((item) => item.id === trip.id);

            if (index !== -1) {
              trips.splice(index, 1);
            }

            navigation.goBack();
          },
        },
      ],
    );
  };
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{trip.name}</Text>

          <Text style={styles.dates}>
            {trip.startDate} — {trip.endDate}
          </Text>

          <Text style={styles.count}>
            {trip.items.length} ponto
            {trip.items.length === 1 ? "" : "s"} turístico
            {trip.items.length === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Roteiro</Text>

          <TouchableOpacity onPress={openEditModal}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* DIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {tripDays.map((date, index) => {
            const isSelected = selectedDay === index;

            const dayItems = trip.items.filter((item) => item.date === date);

            return (
              <TouchableOpacity
                key={date}
                style={[styles.dayButton, isSelected && styles.dayButtonActive]}
                onPress={() => setSelectedDay(index)}
              >
                <Text
                  style={[styles.dayNumber, isSelected && styles.dayTextActive]}
                >
                  Dia {index + 1}
                </Text>

                <Text
                  style={[styles.dayDate, isSelected && styles.dayTextActive]}
                >
                  {date}
                </Text>

                <Text
                  style={[styles.dayCount, isSelected && styles.dayTextActive]}
                >
                  {dayItems.length} ponto
                  {dayItems.length === 1 ? "" : "s"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DIA SELECIONADO */}
        <View style={styles.selectedDayHeader}>
          <View>
            <Text style={styles.selectedDayTitle}>Dia {selectedDay + 1}</Text>

            <Text style={styles.selectedDayDate}>{currentDate}</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Adicionar ponto</Text>
          </TouchableOpacity>
        </View>

        {currentDayItems.length === 0 ? (
          <View style={styles.emptyDay}>
            <Text style={styles.emptyDayTitle}>Nenhum ponto neste dia</Text>

            <Text style={styles.emptyDayText}>
              Adicione um ponto turístico a este dia para começar seu roteiro.
            </Text>

            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Text style={styles.emptyAddButtonText}>+ Adicionar ponto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.items}>
            {currentDayItems.map((item, index) => {
              const touristSpot = touristSpots.find(
                (spot) => spot.id === item.touristSpotId,
              );

              if (!touristSpot) {
                return null;
              }

              return (
                <View key={item.id} style={styles.item}>
                  <TouchableOpacity
                    style={styles.itemMain}
                    onPress={() =>
                      navigation.navigate("TouristSpot", {
                        touristSpotId: touristSpot.id,
                      })
                    }
                  >
                    <View style={styles.orderCircle}>
                      <Text style={styles.orderText}>{index + 1}</Text>
                    </View>

                    <Image
                      source={{ uri: touristSpot.image }}
                      style={styles.image}
                    />

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{touristSpot.name}</Text>

                      <Text style={styles.itemLocation}>
                        {touristSpot.location}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => openDaySelector(item.id)}>
                      <Text style={styles.actionText}>Alterar dia</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text style={styles.removeText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* NÃO PLANEJADOS */}
        {unplannedItems.length > 0 && (
          <View style={styles.unplannedSection}>
            <Text style={styles.unplannedTitle}>Ainda não planejados</Text>

            <Text style={styles.unplannedSubtitle}>
              {unplannedItems.length} ponto
              {unplannedItems.length === 1 ? "" : "s"} aguardando um dia
            </Text>

            {unplannedItems.map((item) => {
              const touristSpot = touristSpots.find(
                (spot) => spot.id === item.touristSpotId,
              );

              if (!touristSpot) {
                return null;
              }

              return (
                <View key={item.id} style={styles.item}>
                  <TouchableOpacity
                    style={styles.itemMain}
                    onPress={() =>
                      navigation.navigate("TouristSpot", {
                        touristSpotId: touristSpot.id,
                      })
                    }
                  >
                    <Image
                      source={{ uri: touristSpot.image }}
                      style={styles.image}
                    />

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{touristSpot.name}</Text>

                      <Text style={styles.itemLocation}>
                        {touristSpot.location}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => openDaySelector(item.id)}>
                      <Text style={styles.actionText}>Definir dia</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text style={styles.removeText}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.deleteTripButton} onPress={deleteTrip}>
          <Text style={styles.deleteTripText}>Excluir viagem</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PARA ADICIONAR PONTO */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Adicionar ao Dia {selectedDay + 1}
            </Text>

            <Text style={styles.modalSubtitle}>{currentDate}</Text>

            <ScrollView
              style={styles.spotList}
              showsVerticalScrollIndicator={false}
            >
              {touristSpots
                .filter(
                  (touristSpot) =>
                    touristSpot.destinationId === trip.destinationId,
                )
                .map((touristSpot) => {
                  const alreadyAdded = trip.items.some(
                    (item) => item.touristSpotId === touristSpot.id,
                  );

                  return (
                    <TouchableOpacity
                      key={touristSpot.id}
                      style={[
                        styles.spotOption,
                        alreadyAdded && styles.spotOptionDisabled,
                      ]}
                      disabled={alreadyAdded}
                      onPress={() => addSpotToCurrentDay(touristSpot.id)}
                    >
                      <Image
                        source={{ uri: touristSpot.image }}
                        style={styles.spotImage}
                      />

                      <View style={styles.spotInfo}>
                        <Text style={styles.spotName}>{touristSpot.name}</Text>

                        <Text style={styles.spotLocation}>
                          {touristSpot.location}
                        </Text>

                        {alreadyAdded && (
                          <Text style={styles.alreadyAdded}>
                            Já está na viagem
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsAddModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA ALTERAR O DIA */}
      <Modal
        visible={isDayModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha o dia</Text>

            <ScrollView
              style={styles.dayList}
              showsVerticalScrollIndicator={false}
            >
              {tripDays.map((date, index) => (
                <TouchableOpacity
                  key={date}
                  style={styles.dayOption}
                  onPress={() => assignItemToDay(date)}
                >
                  <Text style={styles.dayOptionTitle}>Dia {index + 1}</Text>

                  <Text style={styles.dayOptionDate}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsDayModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA EDITAR VIAGEM */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar viagem</Text>

            <Text style={styles.inputLabel}>Nome da viagem</Text>

            <TextInput
              style={styles.tripInput}
              value={editTripName}
              onChangeText={setEditTripName}
              placeholder="Nome da viagem"
            />

            <Text style={styles.inputLabel}>Data de início</Text>

            <TextInput
              style={styles.tripInput}
              value={editStartDate}
              onChangeText={(value) => setEditStartDate(formatInputDate(value))}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.inputLabel}>Data de fim</Text>

            <TextInput
              style={styles.tripInput}
              value={editEndDate}
              onChangeText={(value) => setEditEndDate(formatInputDate(value))}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveTripChanges}
            >
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditModalVisible(false)}
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
    backgroundColor: "#EDEDED",
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  backIcon: {
    fontSize: 25,
  },

  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  dates: {
    marginTop: 8,
    fontSize: 16,
    color: "#666666",
  },

  count: {
    marginTop: 6,
    fontSize: 14,
    color: "#666666",
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  editText: {
    fontSize: 15,
    fontWeight: "600",
  },

  daysContainer: {
    gap: 10,
    paddingBottom: 4,
  },

  dayButton: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  dayButtonActive: {
    backgroundColor: "#000000",
  },

  dayNumber: {
    fontSize: 15,
    fontWeight: "700",
  },

  dayDate: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
  },

  dayCount: {
    marginTop: 5,
    fontSize: 12,
    color: "#888888",
  },

  dayTextActive: {
    color: "#FFFFFF",
  },

  selectedDayHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedDayTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  selectedDayDate: {
    marginTop: 4,
    fontSize: 14,
    color: "#666666",
  },

  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  emptyDay: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },

  emptyDayTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  emptyDayText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
  },

  emptyAddButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
  },

  emptyAddButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  items: {
    gap: 12,
  },

  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
  },

  itemMain: {
    flexDirection: "row",
    alignItems: "center",
  },

  orderCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  orderText: {
    fontSize: 13,
    fontWeight: "700",
  },

  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },

  itemLocation: {
    marginTop: 5,
    fontSize: 13,
    color: "#666666",
  },

  itemActions: {
    flexDirection: "row",
    gap: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },

  removeText: {
    fontSize: 13,
    fontWeight: "600",
  },

  unplannedSection: {
    marginTop: 30,
  },

  unplannedTitle: {
    fontSize: 19,
    fontWeight: "700",
  },

  unplannedSubtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 14,
    color: "#666666",
  },

  deleteTripButton: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 14,
    alignItems: "center",
  },

  deleteTripText: {
    color: "#C62828",
    fontSize: 15,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  modalContainer: {
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 30,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  modalSubtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 14,
    color: "#666666",
  },

  spotList: {
    maxHeight: 430,
  },

  spotOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  spotOptionDisabled: {
    opacity: 0.45,
  },

  spotImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },

  spotInfo: {
    flex: 1,
    marginLeft: 12,
  },

  spotName: {
    fontSize: 15,
    fontWeight: "600",
  },

  spotLocation: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
  },

  alreadyAdded: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },

  dayList: {
    maxHeight: 400,
  },

  dayOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  dayOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  dayOptionDate: {
    marginTop: 4,
    fontSize: 14,
    color: "#666666",
  },

  cancelButton: {
    height: 48,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
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

  saveButton: {
    marginTop: 20,
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

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
