import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

export default function AboutScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          <Text style={styles.title}>Sobre o Tryple</Text>

          <Text style={styles.subtitle}>
            Planeje suas viagens de forma simples e organizada.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que é o Tryple?</Text>

          <Text style={styles.text}>
            O Tryple é um aplicativo desenvolvido para facilitar a descoberta de
            destinos e a organização de viagens em um só lugar.
          </Text>

          <Text style={styles.text}>
            Explore destinos, descubra pontos turísticos, salve seus favoritos e
            monte seus próprios roteiros de viagem.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o projeto</Text>

          <Text style={styles.text}>
            O Tryple foi desenvolvido como um projeto de portfólio e hackathon,
            com foco em experiência do usuário, organização de informações e
            desenvolvimento de aplicações mobile.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologias</Text>

          <Text style={styles.text}>React Native • Expo • TypeScript</Text>
        </View>

        <Text style={styles.version}>Tryple • Versão 1.0</Text>
      </ScrollView>
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
    marginBottom: 24,
  },

  backIcon: {
    fontSize: 25,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 23,
    color: "#666666",
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 10,
  },

  text: {
    fontSize: 15,
    lineHeight: 23,
    color: "#444444",
    marginBottom: 10,
  },

  version: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
    color: "#888888",
  },
});
