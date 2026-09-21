import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../types/navigation";

import { completeWelcome } from "../data/auth";

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleStart = async () => {
    await completeWelcome();

    navigation.replace("Main", {
      screen: "Home",
    });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      }}
      style={styles.container}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>
            Descubra lugares{"\n"}incríveis pelo mundo.
          </Text>

          <Text style={styles.description}>
            Encontre destinos, descubra pontos turísticos e organize suas
            viagens em um só lugar.
          </Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Começar a explorar</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Sua próxima viagem começa aqui.</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 36,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  description: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 24,
    color: "#F2F2F2",
    maxWidth: 340,
  },

  bottom: {
    alignItems: "center",
  },

  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
  },

  footer: {
    marginTop: 16,
    fontSize: 13,
    color: "#E5E5E5",
  },
});
