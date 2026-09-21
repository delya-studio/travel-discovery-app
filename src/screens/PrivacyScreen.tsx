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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Política de Privacidade</Text>

          <Text style={styles.subtitle}>
            Entenda como os dados utilizados pelo Tryple são armazenados e
            utilizados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Dados armazenados</Text>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. Como os dados são utilizados
          </Text>

          <Text style={styles.text}>
            Os dados são utilizados para permitir o acesso à conta, manter as
            informações do perfil e preservar favoritos e viagens criadas dentro
            do aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Armazenamento</Text>

          <Text style={styles.text}>
            Nesta versão do Tryple, os dados são armazenados localmente no
            dispositivo por meio do armazenamento interno do aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Compartilhamento</Text>

          <Text style={styles.text}>
            Nesta versão do aplicativo, os dados cadastrados pelo usuário não
            são compartilhados com terceiros.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Alterações</Text>

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
