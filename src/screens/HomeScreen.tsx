import { useEffect, useRef, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import DestinationCard from "../components/DestinationCard";
import { destinations } from "../data/destinations";
import { RootStackParamList } from "../types/navigation";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const cardsScrollRef = useRef<ScrollView>(null);

  const [selectedState, setSelectedState] = useState("");

  const states = Array.from(
    new Set(destinations.map((destination) => destination.state)),
  );

  const filteredDestinations = selectedState
    ? destinations.filter((destination) => destination.state === selectedState)
    : destinations;

  useEffect(() => {
    cardsScrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }, [selectedState]);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, viajante!</Text>
        <Text style={styles.subtitle}>Bem-vindo ao Tryple</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore destinos</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          <TouchableOpacity
            style={[styles.filter, !selectedState && styles.filterSelected]}
            onPress={() => setSelectedState("")}
          >
            <Text
              style={[
                styles.filterText,
                !selectedState && styles.filterTextSelected,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          {states.map((state) => (
            <TouchableOpacity
              key={state}
              style={[
                styles.filter,
                selectedState === state && styles.filterSelected,
              ]}
              onPress={() => setSelectedState(state)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedState === state && styles.filterTextSelected,
                ]}
              >
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          ref={cardsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cards}
        >
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onPress={() =>
                navigation.navigate("Destination", {
                  destinationId: destination.id,
                })
              }
            />
          ))}
        </ScrollView>

        {filteredDestinations.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum destino encontrado.</Text>
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

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 15,
    marginTop: 6,
  },

  section: {
    marginTop: 10,
    gap: 20,
  },

  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 16,
    fontSize: 22,
    fontWeight: "bold",
  },

  filters: {
    paddingHorizontal: 20,
    gap: 10,
  },

  filter: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },

  filterSelected: {
    backgroundColor: "#252525",
    borderColor: "#252525",
  },

  filterText: {
    fontSize: 14,
  },

  filterTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  cards: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 30,
  },

  empty: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
  },
});
