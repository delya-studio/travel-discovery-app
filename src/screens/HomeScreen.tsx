import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import DestinationCard from "../components/DestinationCard";
import { destinations } from "../data/destinations";
import { RootStackParamList } from "../types/navigation";
import { getLoggedUser } from "../data/auth";

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

  const [userName, setUserName] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const user = await getLoggedUser();

        setUserName(user?.name || "");
      };

      loadUser();
    }, []),
  );

  useEffect(() => {
    cardsScrollRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  }, [selectedState]);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {userName ? `Olá, ${userName}` : "Olá, viajante!"}
        </Text>
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
    backgroundColor: colors.background,
  },

  header: {
    marginTop: 45,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 0,
  },

  greeting: {
    ...typography.h1,
    color: colors.text,
    includeFontPadding: true,
    paddingVertical: 8,
  },

  subtitle: {
    ...typography.bodySmall,
    marginTop: 8,
    color: colors.textSecondary,
  },

  section: {
    marginTop: 20,
    gap: 20,
  },

  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 16,
    includeFontPadding: true,
    paddingVertical: 8,
    ...typography.h2,
    color: colors.text,
  },

  filters: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 10,
  },

  filter: {
    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  filterTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },

  cards: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 30,
    paddingTop: 10,
  },

  empty: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },

  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
