import { useState } from "react";

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

import type { RootStackParamList } from "../types/navigation";

import { loginUser, registerUser } from "../data/auth";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export default function AuthScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, "Auth">>();

  const [isLogin, setIsLogin] = useState(route.params?.mode !== "register");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  type AuthModal = {
    type: "warning" | "success" | "error";
    title: string;
    message: string;
    actionText: string;
    onAction: () => void;
  };

  const [authModal, setAuthModal] = useState<AuthModal | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthModal({
        type: "warning",
        title: "Atenção",
        message: "Preencha o e-mail e a senha.",
        actionText: "Entendi",
        onAction: () => setAuthModal(null),
      });
      return;
    }

    if (!isLogin && !name.trim()) {
      setAuthModal({
        type: "warning",
        title: "Atenção",
        message: "Digite seu nome.",
        actionText: "Entendi",
        onAction: () => setAuthModal(null),
      });
      return;
    }

    if (!isLogin) {
      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

      if (!emailIsValid) {
        setAuthModal({
          type: "warning",
          title: "E-mail inválido",
          message: "Digite um endereço de e-mail válido.",
          actionText: "Entendi",
          onAction: () => setAuthModal(null),
        });
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        await loginUser(email.trim(), password);

        setAuthModal({
          type: "success",
          title: "Login realizado",
          message: "Você entrou na sua conta.",
          actionText: "Continuar",
          onAction: () => {
            setAuthModal(null);
            navigation.navigate("Main", {
              screen: "Home",
            });
          },
        });
      } else {
        await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        setAuthModal({
          type: "success",
          title: "Conta criada",
          message: "Sua conta foi criada com sucesso.",
          actionText: "Continuar",
          onAction: () => {
            setAuthModal(null);
            navigation.navigate("Main", {
              screen: "Home",
            });
          },
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a operação.";

      setAuthModal({
        type: "error",
        title: "Não foi possível continuar",
        message,
        actionText: "Entendi",
        onAction: () => setAuthModal(null),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);

    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

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

        <Text style={styles.title}>
          {isLogin ? "Entre na sua conta" : "Crie sua conta"}
        </Text>

        <Text style={styles.description}>
          {isLogin
            ? "Entre para continuar organizando suas viagens e favoritos."
            : "Crie sua conta para manter suas viagens e favoritos salvos."}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.8}
              />
            ) : (
              <Eye size={20} color={colors.textSecondary} strokeWidth={1.8} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            loading && styles.primaryButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
          </Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
          </Text>

          <TouchableOpacity activeOpacity={0.7} onPress={handleSwitchMode}>
            <Text style={styles.switchButton}>
              {isLogin ? "Criar conta" : "Entrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {authModal && (
        <Modal
          visible
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setAuthModal(null)}
        >
          <View style={styles.authModalOverlay}>
            <View style={styles.authModal}>
              <View style={styles.authModalHeader}>
                <View style={styles.authModalIcon}>
                  {authModal.type === "success" ? (
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
                  style={styles.authModalClose}
                  activeOpacity={0.7}
                  onPress={() => setAuthModal(null)}
                >
                  <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
                </TouchableOpacity>
              </View>

              <Text style={styles.authModalTitle}>{authModal.title}</Text>

              <Text style={styles.authModalMessage}>{authModal.message}</Text>

              <TouchableOpacity
                style={styles.authModalButton}
                activeOpacity={0.8}
                onPress={authModal.onAction}
              >
                <Text style={styles.authModalButtonText}>
                  {authModal.actionText}
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
    maxWidth: 340,
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
    marginBottom: 12,
  },

  passwordContainer: {
    height: 54,
    paddingLeft: 16,
    paddingRight: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 0,
    ...typography.bodySmall,
    color: colors.text,
  },

  primaryButton: {
    height: 54,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginTop: 10,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 5,
  },

  switchText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },

  switchButton: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },

  authModalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  authModal: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 26,
    backgroundColor: colors.background,
  },

  authModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  authModalIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  authModalIconText: {
    fontSize: 23,
    fontWeight: "600",
    color: colors.primary,
  },

  authModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  authModalCloseText: {
    fontSize: 25,
    lineHeight: 27,
    fontWeight: "300",
    color: colors.textSecondary,
  },

  authModalTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },

  authModalMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 22,
  },

  authModalButton: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  authModalButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
