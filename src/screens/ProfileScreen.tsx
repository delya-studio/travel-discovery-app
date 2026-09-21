import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import { useCallback, useState } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

import { getLoggedUser, logoutUser } from "../data/auth";

type User = {
  name: string;
  email: string;
};

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedUser = await getLoggedUser();
        setUser(loggedUser);
      };

      loadUser();
    }, []),
  );

  const handlePersonalData = () => {
    if (!user) {
      Alert.alert(
        "Dados pessoais",
        "Entre ou crie uma conta para acessar seus dados pessoais.",
      );
      return;
    }

    navigation.navigate("PersonalData");
  };

  const handlePreferences = () => {
    Alert.alert(
      "Preferências",
      "As opções de personalização do Tryple serão adicionadas aqui.",
    );
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          setUser(null);
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? user.name.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>
            {user ? `Olá, ${user.name}!` : "Olá, viajante!"}
          </Text>

          <Text style={styles.profileDescription}>
            {user
              ? user.email
              : "Entre ou crie uma conta para salvar suas viagens e favoritos."}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.accountButton}
        activeOpacity={0.8}
        onPress={
          user
            ? handleLogout
            : () =>
                navigation.navigate("Auth", {
                  mode: "login",
                })
        }
      >
        <Text style={styles.accountButtonText}>
          {user ? "Sair da conta" : "Entrar ou criar conta"}
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha conta</Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={handlePersonalData}
        >
          <View>
            <Text style={styles.optionTitle}>Dados pessoais</Text>

            <Text style={styles.optionDescription}>
              {user
                ? "Visualize suas informações"
                : "Gerencie suas informações"}
            </Text>
          </View>

          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={handlePreferences}
        >
          <View>
            <Text style={styles.optionTitle}>Preferências</Text>

            <Text style={styles.optionDescription}>
              Personalize sua experiência
            </Text>
          </View>

          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o Tryple</Text>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={styles.optionTitle}>Sobre o aplicativo</Text>

          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Privacy")}
        >
          <Text style={styles.optionTitle}>Política de privacidade</Text>

          <Text style={styles.optionArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4EE",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },

  profileContent: {
    marginBottom: 10,
    height: 190,
  },

  profileCard: {
    position: "relative",
    width: "auto",
    marginTop: -25,
    marginLeft: -20,
    marginRight: -20,
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#dadaba",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 18,
  },

  avatar: {
    width: 70,
    height: 70,
    bottom: -45,
    borderRadius: 50,
    backgroundColor: "#f5e6bf",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#252525",
  },

  profileInfo: {
    flex: 1,
    bottom: -42,
    paddingLeft: 10,
  },

  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#252525",
    marginBottom: 5,
  },

  profileDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#666666",
  },

  accountButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#252525",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginBottom: 30,
  },

  accountButtonText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 25,
    position: "absolute",
    right: 18,
  },

  section: {
    marginBottom: 26,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#252525",
    marginBottom: 10,
  },

  option: {
    minHeight: 64,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#252525",
  },

  optionDescription: {
    fontSize: 12,
    color: "#777777",
    marginTop: 4,
  },

  optionArrow: {
    fontSize: 23,
    color: "#777777",
  },
});
