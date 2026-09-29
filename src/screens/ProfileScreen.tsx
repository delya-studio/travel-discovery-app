import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import { useCallback, useState } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ChevronRight,
  CircleHelp,
  FileText,
  LogIn,
  LogOut,
  Settings2,
  Shield,
  UserRound,
  X,
} from "lucide-react-native";

import { RootStackParamList } from "../types/navigation";

import { getLoggedUser, logoutUser } from "../data/auth";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

type User = {
  name: string;
  email: string;
};

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<User | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);

    await logoutUser();
    setUser(null);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user ? user.name.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>
              {user ? `Olá, ${user.name}` : "Olá, viajante!"}
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
          <View style={styles.accountButtonIcon}>
            {user ? (
              <LogOut size={18} color={colors.primary} strokeWidth={2} />
            ) : (
              <LogIn size={18} color={colors.primary} strokeWidth={2} />
            )}
          </View>

          <Text style={styles.accountButtonText}>
            {user ? "Sair da conta" : "Entrar ou criar conta"}
          </Text>

          <ChevronRight size={20} color={colors.white} strokeWidth={1.8} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha conta</Text>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={handlePersonalData}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <UserRound size={19} color={colors.primary} strokeWidth={1.8} />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Dados pessoais</Text>

                <Text style={styles.optionDescription}>
                  {user
                    ? "Visualize suas informações"
                    : "Gerencie suas informações"}
                </Text>
              </View>
            </View>

            <ChevronRight
              size={19}
              color={colors.textSecondary}
              strokeWidth={1.8}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={handlePreferences}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <Settings2 size={19} color={colors.primary} strokeWidth={1.8} />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Preferências</Text>

                <Text style={styles.optionDescription}>
                  Personalize sua experiência
                </Text>
              </View>
            </View>

            <ChevronRight
              size={19}
              color={colors.textSecondary}
              strokeWidth={1.8}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Tryple</Text>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <CircleHelp
                  size={19}
                  color={colors.primary}
                  strokeWidth={1.8}
                />
              </View>

              <Text style={styles.optionTitle}>Sobre o aplicativo</Text>
            </View>

            <ChevronRight
              size={19}
              color={colors.textSecondary}
              strokeWidth={1.8}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Privacy")}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <Shield size={19} color={colors.primary} strokeWidth={1.8} />
              </View>

              <Text style={styles.optionTitle}>Política de privacidade</Text>
            </View>

            <ChevronRight
              size={19}
              color={colors.textSecondary}
              strokeWidth={1.8}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.logoutHeader}>
              <View style={styles.logoutIcon}>
                <LogOut size={21} color={colors.primary} strokeWidth={1.9} />
              </View>

              <TouchableOpacity
                style={styles.logoutClose}
                activeOpacity={0.7}
                onPress={() => setLogoutModalVisible(false)}
              >
                <X size={19} color={colors.textSecondary} strokeWidth={1.8} />
              </TouchableOpacity>
            </View>

            <Text style={styles.logoutTitle}>Sair da conta?</Text>

            <Text style={styles.logoutDescription}>
              Você precisará entrar novamente para acessar suas viagens e
              favoritos salvos.
            </Text>

            <TouchableOpacity
              style={styles.logoutConfirmButton}
              activeOpacity={0.8}
              onPress={confirmLogout}
            >
              <Text style={styles.logoutConfirmText}>Sair da conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutCancelButton}
              activeOpacity={0.7}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.logoutCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 35,
  },

  profileHeader: {
    height: 180,
    marginBottom: 38,
    position: "relative",
  },

  profileCard: {
    position: "relative",
    width: "auto",
    height: 120,
    marginTop: -25,
    marginLeft: -22,
    marginRight: -20,
    backgroundColor: colors.primaryLight,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: {
    position: "absolute",
    left: 20,
    bottom: -35,
    width: 72,
    height: 72,
    paddingBottom: 8,
    borderRadius: 36,
    backgroundColor: colors.primaryMedium,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontFamily: "NarnoorBold",
    fontSize: 25,
    color: colors.primaryLight,
  },

  profileInfo: {
    position: "absolute",
    left: 8,
    right: 0,
    top: 145,
  },

  greeting: {
    ...typography.h2,
    fontSize: 24,
    lineHeight: 30,
    color: colors.text,
  },

  profileDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 19,
  },

  accountButton: {
    minHeight: 54,
    paddingLeft: 7,
    paddingRight: 16,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    marginBottom: 32,
  },

  accountButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  accountButtonText: {
    flex: 1,
    marginLeft: 12,
    ...typography.button,
    color: colors.white,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    marginBottom: 12,
  },

  option: {
    minHeight: 70,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: colors.primaryLight,
  },

  optionInfo: {
    flex: 1,
  },

  optionTitle: {
    ...typography.button,
    color: colors.text,
  },

  optionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },

  logoutOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(35, 35, 35, 0.42)",
  },

  logoutModal: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 26,
    backgroundColor: colors.background,
  },

  logoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  logoutIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  logoutClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  logoutCloseText: {
    fontSize: 25,
    lineHeight: 27,
    fontWeight: "300",
    color: colors.textSecondary,
  },

  logoutTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },

  logoutDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 22,
  },

  logoutConfirmButton: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  logoutConfirmText: {
    ...typography.button,
    color: colors.white,
  },

  logoutCancelButton: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  logoutCancelText: {
    ...typography.button,
    color: colors.textSecondary,
  },
});
