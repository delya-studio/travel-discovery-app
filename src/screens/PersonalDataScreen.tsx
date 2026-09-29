import { useEffect, useState } from "react";

import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AlertCircle, ArrowLeft, Check, X } from "lucide-react-native";

import type { RootStackParamList } from "../types/navigation";

import { getLoggedUser, updateUser } from "../data/auth";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

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

  type DataModal = {
    type: "warning" | "success" | "error";
    title: string;
    message: string;
    actionText: string;
    onAction: () => void;
  };

  const [dataModal, setDataModal] = useState<DataModal | null>(null);

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
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!emailIsValid) {
      setDataModal({
        type: "warning",
        title: "E-mail inválido",
        message: "Digite um endereço de e-mail válido.",
        actionText: "Entendi",
        onAction: () => setDataModal(null),
      });
      return;
    }

    if (!name.trim() || !email.trim()) {
      setDataModal({
        type: "warning",
        title: "Atenção",
        message: "Preencha o nome e o e-mail.",
        actionText: "Entendi",
        onAction: () => setDataModal(null),
      });
      return;
    }

    try {
      setLoading(true);

      await updateUser({
        name: name.trim(),
        email: email.trim(),
      });

      setDataModal({
        type: "success",
        title: "Alterações salvas",
        message: "Seus dados foram atualizados com sucesso.",
        actionText: "Continuar",
        onAction: () => {
          setDataModal(null);
          navigation.goBack();
        },
      });
    } catch (error) {
      setDataModal({
        type: "error",
        title: "Não foi possível salvar",
        message:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao atualizar seus dados.",
        actionText: "Entendi",
        onAction: () => setDataModal(null),
      });
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
          <ArrowLeft size={20} color={colors.text} strokeWidth={1.8} />

          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Dados pessoais</Text>

        <Text style={styles.description}>
          Atualize as informações da sua conta.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Text>
        </TouchableOpacity>
      </View>

      {dataModal && (
        <Modal
          visible
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setDataModal(null)}
        >
          <View style={styles.dataModalOverlay}>
            <View style={styles.dataModal}>
              <View style={styles.dataModalHeader}>
                <View style={styles.dataModalIcon}>
                  {dataModal.type === "success" ? (
                    <Check size={22} color={colors.primary} strokeWidth={2.2} />
                  ) : (
                    <AlertCircle
                      size={22}
                      color={colors.primary}
                      strokeWidth={2}
                    />
                  )}
                </View>

                <TouchableOpacity
                  style={styles.dataModalClose}
                  activeOpacity={0.7}
                  onPress={() => setDataModal(null)}
                >
                  <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
                </TouchableOpacity>
              </View>

              <Text style={styles.dataModalTitle}>{dataModal.title}</Text>

              <Text style={styles.dataModalMessage}>{dataModal.message}</Text>

              <TouchableOpacity
                style={styles.dataModalButton}
                activeOpacity={0.8}
                onPress={dataModal.onAction}
              >
                <Text style={styles.dataModalButtonText}>
                  {dataModal.actionText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
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

  title: {
    ...typography.h1,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 10,
  },

  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
  },

  form: {
    gap: 8,
  },

  label: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
    marginBottom: 2,
  },

  input: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: 8,
  },

  saveButton: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginTop: 24,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },

  dataModalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  dataModal: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 26,
    backgroundColor: colors.background,
  },

  dataModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  dataModalIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  dataModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  dataModalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },

  dataModalMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 22,
  },

  dataModalButton: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  dataModalButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
