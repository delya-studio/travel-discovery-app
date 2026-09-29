import React, { useCallback, useRef, useState } from "react";

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
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Check, Search, SlidersHorizontal, X } from "lucide-react-native";

import { RootStackParamList } from "../types/navigation";
import { destinations } from "../data/destinations";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type ExploreScreenRouteProp = RouteProp<RootStackParamList, "Explore">;

export default function ExploreScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const destinationsScrollRef = useRef<ScrollView>(null);
  const route = useRoute<ExploreScreenRouteProp>();

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  useFocusEffect(
    useCallback(() => {
      destinationsScrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
      const country = route.params?.country;
      const state = route.params?.state;

      setSelectedState(state || "");

      return () => {
        setSearch("");
        setSelectedState("");

        navigation.setParams({
          country: undefined,
          state: undefined,
        });
      };
    }, [navigation, route.params?.country, route.params?.state]),
  );

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const states = Array.from(
    new Set(destinations.map((destination) => destination.state)),
  );

  const filteredDestinations = destinations.filter((destination) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      destination.name.toLowerCase().includes(query) ||
      destination.state.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query);

    const matchesCountry = route.params?.country
      ? destination.country === route.params.country
      : true;

    const matchesState = selectedState
      ? destination.state === selectedState
      : true;

    return matchesSearch && matchesCountry && matchesState;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={20} color={colors.textSecondary} strokeWidth={1.8} />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar destino"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.8}
          onPress={() => setIsFilterVisible(true)}
        >
          <SlidersHorizontal size={21} color={colors.white} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {(route.params?.country || selectedState) && (
        <View style={styles.activeFilters}>
          {route.params?.country && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                {route.params.country}
              </Text>
            </View>
          )}

          {selectedState && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{selectedState}</Text>

              <TouchableOpacity
                onPress={() => setSelectedState("")}
                hitSlop={8}
              >
                <X size={14} color={colors.primary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <ScrollView
        ref={destinationsScrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {filteredDestinations.map((destination) => (
          <TouchableOpacity
            key={destination.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("Destination", {
                destinationId: destination.id,
              })
            }
          >
            <Image source={destination.image} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.destinationName}>{destination.name}</Text>

              <Text style={styles.location}>
                {destination.state}, {destination.country}
              </Text>

              <Text style={styles.description} numberOfLines={2}>
                {destination.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredDestinations.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nenhum destino encontrado</Text>

            <Text style={styles.emptyText}>
              Tente buscar outro destino ou alterar os filtros.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsFilterVisible(false)}
              >
                <X size={20} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterTitle}>Estado</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setSelectedState("")}
            >
              <View
                style={[styles.radio, !selectedState && styles.radioSelected]}
              >
                {!selectedState && (
                  <Check size={14} color={colors.white} strokeWidth={2.5} />
                )}
              </View>

              <Text style={styles.optionText}>Todos</Text>
            </TouchableOpacity>

            {states.map((state) => (
              <TouchableOpacity
                key={state}
                style={styles.option}
                onPress={() => setSelectedState(state)}
              >
                <View
                  style={[
                    styles.radio,
                    selectedState === state && styles.radioSelected,
                  ]}
                />

                <Text style={styles.optionText}>{state}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsFilterVisible(false)}
            >
              <Text style={styles.applyButtonText}>Aplicar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 90,
    backgroundColor: colors.background,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 70,
    includeFontPadding: true,
    paddingVertical: 8,
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },

  searchBox: {
    flex: 1,
    height: 52,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,

    borderRadius: 60,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchInput: {
    flex: 1,

    marginLeft: 8,

    paddingVertical: 0,

    ...typography.bodySmall,
    color: colors.text,
  },

  filterButton: {
    width: 52,
    height: 52,

    borderRadius: 60,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,
  },

  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  activeFilter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor: colors.primaryLight,
  },

  activeFilterText: {
    ...typography.caption,
    color: colors.primary,
  },

  list: {
    paddingBottom: 30,
    gap: 18,
  },

  card: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  image: {
    width: "100%",
    height: 190,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  cardContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 10,
  },

  destinationName: {
    ...typography.destination,
    color: colors.text,
  },

  location: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 3,
    marginBottom: 12,
  },

  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 8,
  },

  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",

    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(35, 35, 35, 0.35)",
  },

  filterModal: {
    backgroundColor: colors.background,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    padding: 24,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 25,
  },

  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surface,
  },

  filterTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 10,
  },

  radio: {
    width: 22,
    height: 22,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: colors.border,

    marginRight: 10,

    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    backgroundColor: colors.primaryMedium,
    borderColor: colors.primaryMedium,
  },

  optionText: {
    ...typography.body,
    color: colors.text,
  },

  applyButton: {
    height: 52,

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 20,

    backgroundColor: colors.primary,
  },

  applyButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
