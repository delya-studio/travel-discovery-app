import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ArrowLeft, Code2, Compass, Heart, Map } from "lucide-react-native";

import type { RootStackParamList } from "../types/navigation";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

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
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={1.8} />

          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Sobre o Tryple</Text>

          <Text style={styles.subtitle}>
            Planeje suas viagens de forma simples e organizada.
          </Text>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Compass size={24} color={colors.primary} strokeWidth={1.8} />
          </View>

          <Text style={styles.introText}>
            Descubra lugares, organize suas viagens e tenha tudo reunido em um
            só lugar.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Map size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionTitle}>O que é o Tryple?</Text>
          </View>

          <Text style={styles.text}>
            O Tryple é um aplicativo desenvolvido para facilitar a descoberta de
            destinos e a organização de viagens em um só lugar.
          </Text>

          <Text style={styles.text}>
            Explore destinos, descubra pontos turísticos, salve seus favoritos e
            monte seus próprios roteiros de viagem.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Heart size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionTitle}>Sobre o projeto</Text>
          </View>

          <Text style={styles.text}>
            O Tryple foi desenvolvido como um projeto de portfólio e hackathon,
            com foco em experiência do usuário, organização de informações e
            desenvolvimento de aplicações mobile.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Code2 size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionTitle}>Tecnologias</Text>
          </View>

          <View style={styles.techRow}>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>React Native</Text>
            </View>

            <View style={styles.techBadge}>
              <Text style={styles.techText}>Expo</Text>
            </View>

            <View style={styles.techBadge}>
              <Text style={styles.techText}>TypeScript</Text>
            </View>
          </View>
        </View>

        <Text style={styles.version}>Tryple • Versão 1.0</Text>
      </ScrollView>
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

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 42,
  },

  backText: {
    ...typography.bodySmall,
    color: colors.text,
  },

  header: {
    marginBottom: 30,
  },

  title: {
    ...typography.h1,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 10,
  },

  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 23,
  },

  introCard: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    marginBottom: 30,
  },

  introIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    marginBottom: 14,
  },

  introText: {
    ...typography.h3,
    fontSize: 19,
    lineHeight: 27,
    color: colors.primary,
  },

  section: {
    paddingHorizontal: 2,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    marginRight: 10,
  },

  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
  },

  text: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 26,
  },

  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  techBadge: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  techText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },

  version: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 30,
  },
});
