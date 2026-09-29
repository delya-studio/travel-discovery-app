import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";

import type { RootStackParamList } from "../types/navigation";
import { completeWelcome } from "../data/auth";

import { typography } from "../theme/typography";
import { colors } from "../theme/colors";

type WelcomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavigationProp>();

  const handleStart = async () => {
    await completeWelcome();

    navigation.replace("Main", {
      screen: "Home",
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/imgs/pexels-weliton-pereira-922918101-19977553.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title}>
            Descubra lugares{"\n"}
            incríveis pelo Brasil.
          </Text>

          <Text style={styles.description}>
            Encontre destinos, descubra pontos turísticos e organize suas
            viagens em um só lugar.
          </Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleStart}
          >
            <BlurView
              intensity={35}
              tint="light"
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.buttonOverlay} />

            <Text style={styles.buttonText}>Começar a explorar</Text>

            <View style={styles.buttonIcon}>
              <ArrowUpRight size={21} strokeWidth={2} color={colors.primary} />
            </View>
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(35, 35, 35, 0.48)",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 82,
    gap: 80,
    justifyContent: "flex-end",
  },

  textContent: {
    maxWidth: 400,
  },

  title: {
    ...typography.display,
    fontSize: 70,
    lineHeight: 70,
    includeFontPadding: true,
    paddingVertical: 8,
    color: colors.white,
  },

  description: {
    marginTop: 18,
    maxWidth: 330,
    fontFamily: "System",
    fontSize: 16,
    lineHeight: 24,
    color: colors.background,
  },

  bottom: {
    alignItems: "center",
  },

  button: {
    width: "100%",
    minHeight: 62,
    paddingLeft: 32,
    paddingRight: 7,
    borderRadius: 32,
    overflow: "hidden",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0,
    borderColor: "none",
  },

  buttonOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(12, 12, 12, 0.25)",
  },

  buttonText: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
  },

  buttonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    marginTop: 14,
    fontFamily: "System",
    fontSize: 12,
    color: "#E6E3D9",
  },
});
