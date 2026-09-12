import React, {
  useCallback,
  useRef,
  useState,
} from "react";
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

import { RootStackParamList } from "../types/navigation";
import { destinations } from "../data/destinations";

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
      <Text style={styles.title}>Explore</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar destino"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(true)}
        >
          <Text style={styles.filterIcon}>☷</Text>
        </TouchableOpacity>
      </View>

      {(route.params?.country || selectedState) && (
        <View style={styles.activeFilters}>
          {route.params?.country && (
            <Text style={styles.activeFilterText}>
              {route.params.country}
            </Text>
          )}

          {selectedState && (
            <Text style={styles.activeFilterText}>{selectedState}</Text>
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
            <Image source={{ uri: destination.image }} style={styles.image} />

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
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>

              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterTitle}>Estado</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setSelectedState("")}
            >
              <View
                style={[styles.radio, !selectedState && styles.radioSelected]}
              />

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
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  filterButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  filterIcon: {
    fontSize: 24,
  },

  activeFilters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  activeFilterText: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
    fontSize: 13,
  },

  list: {
    paddingBottom: 30,
    gap: 16,
  },

  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  image: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 16,
  },

  destinationName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },

  location: {
    fontSize: 14,
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  filterModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    fontSize: 22,
    fontWeight: "700",
  },

  closeButton: {
    fontSize: 30,
    lineHeight: 30,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999999",
    marginRight: 10,
  },

  radioSelected: {
    borderWidth: 6,
  },

  optionText: {
    fontSize: 16,
  },

  applyButton: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#252525",
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
