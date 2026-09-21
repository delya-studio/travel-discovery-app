import { useState } from "react";

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

import { Eye, EyeOff } from "lucide-react-native";

import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

import type { RootStackParamList } from "../types/navigation";

import { loginUser, registerUser } from "../data/auth";

export default function AuthScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, "Auth">>();

  const [isLogin, setIsLogin] = useState(route.params?.mode !== "register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert("Atenção", "Digite seu nome.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        await loginUser(email.trim(), password);

        Alert.alert("Login realizado", "Você entrou na sua conta.", [
          {
            text: "Continuar",
            onPress: () =>
              navigation.navigate("Main", {
                screen: "Home",
              }),
          },
        ]);
      } else {
        await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        Alert.alert("Conta criada", "Sua conta foi criada com sucesso.", [
          {
            text: "Continuar",
            onPress: () =>
              navigation.navigate("Main", {
                screen: "Home",
              }),
          },
        ]);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a operação.";

      Alert.alert("Não foi possível continuar", message);
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
          <Text style={styles.backArrow}>‹</Text>
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
              <EyeOff size={20} color="#666" />
            ) : (
              <Eye size={20} color="#666" />
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
    maxWidth: 340,
  },

  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#252525",
    marginBottom: 12,
  },

  passwordContainer: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#252525",
  },

  primaryButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    gap: 5,
  },

  switchText: {
    fontSize: 13,
    color: "#666666",
  },

  switchButton: {
    fontSize: 13,
    fontWeight: "700",
    color: "#252525",
  },
});
