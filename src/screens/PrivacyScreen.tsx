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

import {
  AlertCircle,
  ArrowLeft,
  Database,
  FileText,
  LockKeyhole,
  Share2,
} from "lucide-react-native";

import type { RootStackParamList } from "../types/navigation";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function PrivacyScreen() {
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
          <Text style={styles.title}>Política de Privacidade</Text>

          <Text style={styles.subtitle}>
            Entenda como os dados utilizados pelo Tryple são armazenados e
            utilizados.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <LockKeyhole size={23} color={colors.primary} strokeWidth={1.8} />
          </View>

          <Text style={styles.infoText}>
            Esta política descreve como os dados são tratados nesta versão do
            Tryple.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Database size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionNumber}>01</Text>

            <Text style={styles.sectionTitle}>Dados armazenados</Text>
          </View>

          <Text style={styles.text}>
            Para o funcionamento das funcionalidades de conta, o Tryple pode
            armazenar informações como nome, e-mail e senha cadastrados pelo
            usuário.
          </Text>

          <Text style={styles.text}>
            O aplicativo também armazena informações relacionadas aos favoritos
            e às viagens criadas pelo usuário.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <FileText size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionNumber}>02</Text>

            <Text style={styles.sectionTitle}>
              Como os dados são utilizados
            </Text>
          </View>

          <Text style={styles.text}>
            Os dados são utilizados para permitir o acesso à conta, manter as
            informações do perfil e preservar favoritos e viagens criadas dentro
            do aplicativo.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <LockKeyhole size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionNumber}>03</Text>

            <Text style={styles.sectionTitle}>Armazenamento</Text>
          </View>

          <Text style={styles.text}>
            Nesta versão do Tryple, os dados são armazenados localmente no
            dispositivo por meio do armazenamento interno do aplicativo.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Share2 size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionNumber}>04</Text>

            <Text style={styles.sectionTitle}>Compartilhamento</Text>
          </View>

          <Text style={styles.text}>
            Nesta versão do aplicativo, os dados cadastrados pelo usuário não
            são compartilhados com terceiros.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <AlertCircle size={19} color={colors.primary} strokeWidth={1.8} />
            </View>

            <Text style={styles.sectionNumber}>05</Text>

            <Text style={styles.sectionTitle}>Alterações</Text>
          </View>

          <Text style={styles.text}>
            Esta política poderá ser atualizada conforme novas funcionalidades e
            serviços forem adicionados ao Tryple.
          </Text>
        </View>

        <Text style={styles.version}>Tryple • Política de Privacidade</Text>
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

  infoCard: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    marginBottom: 30,
  },

  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    marginBottom: 14,
  },

  infoText: {
    ...typography.h3,
    fontSize: 18,
    lineHeight: 26,
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
    marginRight: 9,
  },

  sectionNumber: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    marginRight: 8,
  },

  sectionTitle: {
    flex: 1,
    ...typography.h3,
    fontSize: 19,
    lineHeight: 25,
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

  version: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 30,
  },
});
