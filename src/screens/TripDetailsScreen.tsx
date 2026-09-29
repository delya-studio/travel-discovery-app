import React, { useCallback, useState } from "react";

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
  CalendarDays,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";

import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

import { getTrips, updateTrip, deleteTrip as removeTrip } from "../data/trips";

import { Trip } from "../types/trip";
import { touristSpots } from "../data/touristSpots";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type TripDetailsRouteProp = RouteProp<RootStackParamList, "TripDetails">;

type DeleteModal = {
  visible: boolean;
};

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

  const [trip, setTrip] = useState<Trip | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadTrip = async () => {
        const storedTrips = await getTrips();

        const foundTrip = storedTrips.find((item) => item.id === tripId);

        setTrip(foundTrip || null);
      };

      loadTrip();
    }, [tripId]),
  );

  const [selectedDay, setSelectedDay] = useState(0);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [isDayModalVisible, setIsDayModalVisible] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [editTripName, setEditTripName] = useState("");

  const [editStartDate, setEditStartDate] = useState("");

  const [editEndDate, setEditEndDate] = useState("");

  const [deleteModal, setDeleteModal] = useState<DeleteModal>({
    visible: false,
  });

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Viagem não encontrada.</Text>
      </View>
    );
  }

  const tripDays = generateTripDays(trip.startDate, trip.endDate);

  const currentDate = tripDays[selectedDay];

  const currentDayItems = trip.items.filter(
    (item) => item.date === currentDate,
  );

  const unplannedItems = trip.items.filter((item) => !item.date);

  const addSpotToCurrentDay = async (touristSpotId: string) => {
    if (!trip) {
      return;
    }

    const alreadyAdded = trip.items.some(
      (item) => item.touristSpotId === touristSpotId,
    );

    if (alreadyAdded) {
      return;
    }

    const updatedTrip: Trip = {
      ...trip,
      items: [
        ...trip.items,
        {
          id: Date.now().toString(),
          touristSpotId,
          date: currentDate,
        },
      ],
    };

    await updateTrip(updatedTrip);

    setTrip(updatedTrip);
    setIsAddModalVisible(false);
  };

  const openDaySelector = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDayModalVisible(true);
  };

  const assignItemToDay = async (date: string) => {
    if (!trip || !selectedItemId) {
      return;
    }

    const updatedTrip: Trip = {
      ...trip,

      items: trip.items.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              date,
            }
          : item,
      ),
    };

    await updateTrip(updatedTrip);

    setTrip(updatedTrip);
    setSelectedItemId(null);
    setIsDayModalVisible(false);
  };

  const removeItem = async (itemId: string) => {
    if (!trip) {
      return;
    }

    const updatedTrip: Trip = {
      ...trip,
      items: trip.items.filter((item) => item.id !== itemId),
    };

    await updateTrip(updatedTrip);

    setTrip(updatedTrip);
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

  const saveTripChanges = async () => {
    if (
      !trip ||
      !editTripName.trim() ||
      editStartDate.length !== 10 ||
      editEndDate.length !== 10
    ) {
      return;
    }

    const updatedTrip: Trip = {
      ...trip,
      name: editTripName.trim(),
      startDate: editStartDate,
      endDate: editEndDate,
    };

    await updateTrip(updatedTrip);

    setTrip(updatedTrip);
    setIsEditModalVisible(false);
    setSelectedDay(0);
  };

  const deleteTrip = () => {
    if (!trip) {
      return;
    }

    setDeleteModal({
      visible: true,
    });
  };

  const confirmDeleteTrip = async () => {
    if (!trip) {
      return;
    }

    setDeleteModal({
      visible: false,
    });

    await removeTrip(trip.id);

    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* VOLTAR */}

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={1.9} />

          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {/* CABEÇALHO DA VIAGEM */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <CalendarDays
                size={21}
                color={colors.primary}
                strokeWidth={1.8}
              />
            </View>

            <Text style={styles.title}>{trip.name}</Text>
          </View>

          <Text style={styles.dates}>
            {trip.startDate} — {trip.endDate}
          </Text>

          <Text style={styles.count}>
            {trip.items.length} ponto
            {trip.items.length === 1 ? "" : "s"} turístico
            {trip.items.length === 1 ? "" : "s"}
          </Text>
        </View>

        {/* ROTEIRO */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Roteiro</Text>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.7}
            onPress={openEditModal}
          >
            <Pencil size={15} color={colors.primary} strokeWidth={1.9} />

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
                activeOpacity={0.8}
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
            activeOpacity={0.8}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Plus size={17} color={colors.white} strokeWidth={2} />

            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* ITENS DO DIA */}

        {currentDayItems.length === 0 ? (
          <View style={styles.emptyDay}>
            <View style={styles.emptyDayIcon}>
              <MapPin size={21} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.emptyDayTitle}>Nenhum ponto neste dia</Text>

            <Text style={styles.emptyDayText}>
              Adicione um ponto turístico a este dia para começar seu roteiro.
            </Text>

            <TouchableOpacity
              style={styles.emptyAddButton}
              activeOpacity={0.8}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Plus size={17} color={colors.primary} strokeWidth={2} />

              <Text style={styles.emptyAddButtonText}>Adicionar ponto</Text>
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
                    activeOpacity={0.8}
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
                      source={{
                        uri: touristSpot.image,
                      }}
                      style={styles.image}
                    />

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {touristSpot.name}
                      </Text>

                      <View style={styles.locationRow}>
                        <MapPin
                          size={13}
                          color={colors.textSecondary}
                          strokeWidth={1.8}
                        />

                        <Text style={styles.itemLocation} numberOfLines={1}>
                          {touristSpot.location}
                        </Text>
                      </View>
                    </View>

                    <ChevronRight
                      size={18}
                      color={colors.textSecondary}
                      strokeWidth={1.7}
                    />
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
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("TouristSpot", {
                        touristSpotId: touristSpot.id,
                      })
                    }
                  >
                    <Image
                      source={{
                        uri: touristSpot.image,
                      }}
                      style={styles.image}
                    />

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {touristSpot.name}
                      </Text>

                      <View style={styles.locationRow}>
                        <MapPin
                          size={13}
                          color={colors.textSecondary}
                          strokeWidth={1.8}
                        />

                        <Text style={styles.itemLocation} numberOfLines={1}>
                          {touristSpot.location}
                        </Text>
                      </View>
                    </View>

                    <ChevronRight
                      size={18}
                      color={colors.textSecondary}
                      strokeWidth={1.7}
                    />
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

        {/* EXCLUIR */}

        <TouchableOpacity
          style={styles.deleteTripButton}
          activeOpacity={0.7}
          onPress={deleteTrip}
        >
          <Trash2 size={17} color={colors.error} strokeWidth={1.8} />

          <Text style={styles.deleteTripText}>Excluir viagem</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PARA ADICIONAR PONTO */}

      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Adicionar ao Dia {selectedDay + 1}
                </Text>

                <Text style={styles.modalSubtitle}>{currentDate}</Text>
              </View>

              <TouchableOpacity
                style={styles.modalClose}
                activeOpacity={0.7}
                onPress={() => setIsAddModalVisible(false)}
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

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
                      activeOpacity={0.75}
                      onPress={() => addSpotToCurrentDay(touristSpot.id)}
                    >
                      <Image
                        source={{
                          uri: touristSpot.image,
                        }}
                        style={styles.spotImage}
                      />

                      <View style={styles.spotInfo}>
                        <Text style={styles.spotName} numberOfLines={2}>
                          {touristSpot.name}
                        </Text>

                        <View style={styles.locationRow}>
                          <MapPin
                            size={12}
                            color={colors.textSecondary}
                            strokeWidth={1.8}
                          />

                          <Text style={styles.spotLocation} numberOfLines={1}>
                            {touristSpot.location}
                          </Text>
                        </View>

                        {alreadyAdded && (
                          <Text style={styles.alreadyAdded}>
                            Já está na viagem
                          </Text>
                        )}
                      </View>

                      {!alreadyAdded && (
                        <Plus
                          size={19}
                          color={colors.primary}
                          strokeWidth={2}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
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
        statusBarTranslucent
        onRequestClose={() => setIsDayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha o dia</Text>

              <TouchableOpacity
                style={styles.modalClose}
                activeOpacity={0.7}
                onPress={() => setIsDayModalVisible(false)}
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.dayList}
              showsVerticalScrollIndicator={false}
            >
              {tripDays.map((date, index) => (
                <TouchableOpacity
                  key={date}
                  style={styles.dayOption}
                  activeOpacity={0.7}
                  onPress={() => assignItemToDay(date)}
                >
                  <View>
                    <Text style={styles.dayOptionTitle}>Dia {index + 1}</Text>

                    <Text style={styles.dayOptionDate}>{date}</Text>
                  </View>

                  <ChevronRight
                    size={18}
                    color={colors.textSecondary}
                    strokeWidth={1.7}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
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
        statusBarTranslucent
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar viagem</Text>

              <TouchableOpacity
                style={styles.modalClose}
                activeOpacity={0.7}
                onPress={() => setIsEditModalVisible(false)}
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nome da viagem</Text>

            <TextInput
              style={styles.tripInput}
              value={editTripName}
              onChangeText={setEditTripName}
              placeholder="Nome da viagem"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Data de início</Text>

            <TextInput
              style={styles.tripInput}
              value={editStartDate}
              onChangeText={(value) => setEditStartDate(formatInputDate(value))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.inputLabel}>Data de fim</Text>

            <TextInput
              style={styles.tripInput}
              value={editEndDate}
              onChangeText={(value) => setEditEndDate(formatInputDate(value))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={saveTripChanges}
            >
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA EXCLUIR VIAGEM */}

      <Modal
        visible={deleteModal.visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() =>
          setDeleteModal({
            visible: false,
          })
        }
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteModalHeader}>
              <View style={styles.deleteIcon}>
                <AlertCircle size={22} color={colors.error} strokeWidth={1.9} />
              </View>

              <TouchableOpacity
                style={styles.modalClose}
                activeOpacity={0.7}
                onPress={() =>
                  setDeleteModal({
                    visible: false,
                  })
                }
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            <Text style={styles.deleteModalTitle}>Excluir viagem</Text>

            <Text style={styles.deleteModalMessage}>
              Tem certeza que deseja excluir "{trip.name}"? Esta ação não pode
              ser desfeita.
            </Text>

            <TouchableOpacity
              style={styles.deleteConfirmButton}
              activeOpacity={0.8}
              onPress={confirmDeleteTrip}
            >
              <Text style={styles.deleteConfirmText}>Excluir viagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={() =>
                setDeleteModal({
                  visible: false,
                })
              }
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
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // VOLTAR

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

  // CABEÇALHO

  header: {
    padding: 20,

    borderRadius: 24,

    backgroundColor: colors.primaryLight,

    borderWidth: 1,
    borderColor: colors.border,
  },

  headerContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },

  headerIcon: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.background,

    marginBottom: 14,
  },

  title: {
    ...typography.h1,

    fontSize: 32,
    lineHeight: 38,
    marginTop: -24,

    color: colors.text,
  },

  dates: {
    ...typography.body,

    color: colors.textSecondary,

    marginLeft: 7,
  },

  count: {
    ...typography.bodySmall,

    color: colors.primaryMedium,

    fontWeight: "600",
    marginLeft: 7,
    marginTop: 7,
  },

  // CABEÇALHO ROTEIRO

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    ...typography.h2,

    fontSize: 25,
    lineHeight: 31,

    color: colors.text,
  },

  editButton: {
    height: 36,

    paddingHorizontal: 12,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    backgroundColor: colors.primaryLight,
  },

  editText: {
    ...typography.caption,

    color: colors.primary,

    marginTop: -5,
    fontWeight: "600",
  },

  // DIAS

  daysContainer: {
    gap: 10,

    paddingBottom: 4,
  },

  dayButton: {
    width: 115,

    paddingVertical: 13,
    paddingHorizontal: 10,

    borderRadius: 18,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
  },

  dayButtonActive: {
    backgroundColor: colors.primary,

    borderColor: colors.primary,
  },

  dayNumber: {
    ...typography.bodySmall,

    color: colors.text,

    fontWeight: "600",
  },

  dayDate: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 4,
  },

  dayCount: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 5,
  },

  dayTextActive: {
    color: colors.white,
  },

  // DIA SELECIONADO

  selectedDayHeader: {
    marginTop: 26,
    marginBottom: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedDayTitle: {
    ...typography.h3,

    fontSize: 21,
    lineHeight: 27,

    color: colors.text,
  },

  selectedDayDate: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 3,
  },

  addButton: {
    height: 40,

    paddingHorizontal: 18,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    backgroundColor: colors.primary,
  },

  addButtonText: {
    ...typography.caption,

    color: colors.white,
    marginTop: -5,
    fontWeight: "600",
  },

  // DIA VAZIO

  emptyDay: {
    padding: 22,

    borderRadius: 20,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "flex-start",
  },

  emptyDayIcon: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,

    marginBottom: 14,
  },

  emptyDayTitle: {
    ...typography.h3,

    fontSize: 19,
    lineHeight: 25,

    color: colors.text,
  },

  emptyDayText: {
    ...typography.bodySmall,

    color: colors.textSecondary,

    lineHeight: 20,

    marginTop: 6,
  },

  emptyAddButton: {
    height: 44,

    paddingHorizontal: 15,

    borderRadius: 22,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    backgroundColor: colors.primaryLight,

    marginTop: 16,
  },

  emptyAddButtonText: {
    ...typography.caption,

    color: colors.primary,

    fontWeight: "600",
  },

  // ITENS

  items: {
    gap: 12,
  },

  item: {
    padding: 12,

    borderRadius: 20,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
  },

  itemMain: {
    flexDirection: "row",
    alignItems: "center",
  },

  orderCircle: {
    width: 28,
    height: 28,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.border,

    marginRight: 12,
  },

  orderText: {
    ...typography.caption,

    color: colors.primaryMedium,

    fontWeight: "700",
  },

  image: {
    width: 76,
    height: 76,

    borderRadius: 14,
  },

  itemInfo: {
    flex: 1,

    marginLeft: 15,
    marginRight: 8,
  },

  itemName: {
    ...typography.body,

    color: colors.text,

    fontWeight: "600",

    lineHeight: 20,
    marginBottom: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 4,

    marginTop: 6,
  },

  itemLocation: {
    flex: 1,

    ...typography.caption,
    marginTop: -5,
    color: colors.textSecondary,
  },

  itemActions: {
    flexDirection: "row",

    gap: 18,

    marginTop: 10,
    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionText: {
    ...typography.caption,

    color: colors.primary,

    fontWeight: "600",
  },

  removeText: {
    ...typography.caption,

    color: colors.error,

    fontWeight: "600",
  },

  // NÃO PLANEJADOS

  unplannedSection: {
    marginTop: 30,
  },

  unplannedTitle: {
    ...typography.h3,

    fontSize: 20,
    lineHeight: 26,

    color: colors.text,
  },

  unplannedSubtitle: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 4,
    marginBottom: 12,
  },

  // EXCLUIR

  deleteTripButton: {
    height: 48,

    marginTop: 26,
    marginBottom: 10,

    borderRadius: 24,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    backgroundColor: "rgba(169, 74, 66, 0.08)",
  },

  deleteTripText: {
    ...typography.caption,

    color: colors.error,
    marginTop: -5,
    fontWeight: "600",
  },

  // MODAIS

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  modalContainer: {
    maxHeight: "82%",

    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 30,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    backgroundColor: colors.background,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  modalTitle: {
    ...typography.h2,

    fontSize: 23,
    lineHeight: 29,

    color: colors.text,
  },

  modalSubtitle: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 3,
  },

  modalClose: {
    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surface,
  },

  spotList: {
    maxHeight: 430,
  },

  spotOption: {
    minHeight: 78,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  spotOptionDisabled: {
    opacity: 0.45,
  },

  spotImage: {
    width: 65,
    height: 65,

    borderRadius: 13,
  },

  spotInfo: {
    flex: 1,

    marginLeft: 12,
    marginRight: 10,
  },

  spotName: {
    ...typography.bodySmall,

    color: colors.text,

    fontWeight: "600",

    lineHeight: 19,
  },

  spotLocation: {
    flex: 1,

    ...typography.caption,

    color: colors.textSecondary,
  },

  alreadyAdded: {
    ...typography.caption,

    color: colors.primary,

    fontWeight: "600",

    marginTop: 5,
  },

  dayList: {
    maxHeight: 400,
  },

  dayOption: {
    minHeight: 64,

    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  dayOptionTitle: {
    ...typography.bodySmall,

    color: colors.text,

    fontWeight: "600",
  },

  dayOptionDate: {
    ...typography.caption,

    color: colors.textSecondary,

    marginTop: 4,
  },

  inputLabel: {
    ...typography.caption,

    color: colors.text,

    fontWeight: "600",

    marginBottom: 6,
    marginTop: 10,
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

    marginBottom: 6,
  },

  saveButton: {
    height: 52,

    marginTop: 18,

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

  // MODAL EXCLUSÃO

  deleteOverlay: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,

    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  deleteModal: {
    width: "100%",
    maxWidth: 360,

    padding: 24,

    borderRadius: 26,

    backgroundColor: colors.background,
  },

  deleteModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 20,
  },

  deleteIcon: {
    width: 46,
    height: 46,

    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(169, 74, 66, 0.10)",
  },

  deleteModalTitle: {
    ...typography.h2,

    color: colors.text,

    marginBottom: 8,
  },

  deleteModalMessage: {
    ...typography.bodySmall,

    color: colors.textSecondary,

    lineHeight: 21,

    marginBottom: 20,
  },

  deleteConfirmButton: {
    height: 50,

    borderRadius: 25,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.error,
  },

  deleteConfirmText: {
    ...typography.button,

    color: colors.white,
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
