import { useEffect, useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../types/navigation";

import { getLoggedUser, updateUser } from "../data/auth";

type User = {
  name: string;
  email: string;
};

export default function PersonalDataScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        navigation.goBack();
        return;
      }

      setUser(loggedUser);
      setName(loggedUser.name);
      setEmail(loggedUser.email);
    };

    loadUser();
  }, [navigation]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha o nome e o e-mail.",
      );
      return;
    }

    try {
      setLoading(true);

      await updateUser({
        name: name.trim(),
        email: email.trim(),
      });

      Alert.alert(
        "Alterações salvas",
        "Seus dados foram atualizados com sucesso.",
        [
          {
            text: "Continuar",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Não foi possível salvar",
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao atualizar seus dados.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>‹</Text>

          <Text style={styles.backText}>
            Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Dados pessoais
        </Text>

        <Text style={styles.description}>
          Atualize as informações da sua conta.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#888"
            autoCapitalize="words"
          />

          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            loading && styles.saveButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading
              ? "Salvando..."
              : "Salvar alterações"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4EE",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },

  backArrow: {
    fontSize: 30,
    color: "#252525",
    marginRight: 5,
  },

  backText: {
    fontSize: 14,
    color: "#555555",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#252525",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
    marginBottom: 30,
  },

  form: {
    gap: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#252525",
    marginTop: 8,
  },

  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#252525",
    marginBottom: 8,
  },

  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});