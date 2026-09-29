import { useCallback, useState, useEffect } from "react";
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ArrowUpRight, Heart, UserRound, X } from "lucide-react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Destination } from "../types/destination";
import { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";

import {
  isDestinationFavorite,
  toggleFavoriteDestination,
} from "../data/favorites";

import { getLoggedUser } from "../data/auth";

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
}

export default function DestinationCard({
  destination,
  onPress,
}: DestinationCardProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadFavorite = async () => {
        const user = await getLoggedUser();

        if (!user) {
          setIsFavorite(false);
          return;
        }

        const favorite = await isDestinationFavorite(destination.id);
        setIsFavorite(favorite);
      };

      loadFavorite();
    }, [destination.id]),
  );

  const handleFavorite = async () => {
    const user = await getLoggedUser();

    if (!user) {
      setIsLoginModalVisible(true);
      return;
    }

    const result = await toggleFavoriteDestination(destination.id);

    if (result !== null) {
      setIsFavorite(result);
    }
  };

  const handleLogin = () => {
    setIsLoginModalVisible(false);

    navigation.navigate("Auth", {
      mode: "login",
    });
  };

  return (
    <>
      <Pressable style={styles.card} onPress={onPress}>
        <ImageBackground
          source={destination.image}
          style={styles.image}
          imageStyle={styles.imageRadius}
        >
          <View style={styles.overlay} />

          <Pressable
            style={styles.favoriteButton}
            onPress={handleFavorite}
            hitSlop={8}
          >
            <Heart
              size={20}
              color={colors.primaryMedium}
              strokeWidth={1.8}
              fill={isFavorite ? colors.primaryMedium : "transparent"}
            />
          </Pressable>

          <View style={styles.content}>
            <Text style={styles.location}>{destination.country}</Text>

            <Text style={styles.name}>{destination.name}</Text>

            <Pressable style={styles.moreButton} onPress={onPress}>
              <Text style={styles.moreButtonText}>Ver destino</Text>

              <View style={styles.moreButtonIcon}>
                <ArrowUpRight size={18} color={colors.white} strokeWidth={2} />
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Pressable>

      <Modal
        visible={isLoginModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsLoginModalVisible(false)}
      >
        <View style={styles.loginModalOverlay}>
          <View style={styles.loginModal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <UserRound size={21} color={colors.primary} strokeWidth={1.8} />
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setIsLoginModalVisible(false)}
                hitSlop={8}
              >
                <X size={19} color={colors.text} strokeWidth={2} />
              </Pressable>
            </View>

            <Text style={styles.modalTitle}>Entre na sua conta</Text>

            <Text style={styles.modalText}>
              Você precisa estar logado para adicionar destinos aos favoritos.
            </Text>

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setIsLoginModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 317,
    height: 434,
    borderRadius: 22,
    overflow: "hidden",
  },

  image: {
    flex: 1,
    justifyContent: "flex-end",
  },

  imageRadius: {
    borderRadius: 22,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(35, 35, 35, 0.64)",
  },

  favoriteButton: {
    position: "absolute",
    top: 18,
    right: 18,

    width: 46,
    height: 46,
    borderRadius: 60,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },

  location: {
    fontFamily: "Narnoor",
    fontSize: 15,
    textTransform: "uppercase",
    color: colors.white,
    opacity: 0.9,
    marginBottom: -5,
  },

  name: {
    fontFamily: "NarnoorBold",
    fontSize: 38,
    lineHeight: 40,
    includeFontPadding: true,
    paddingVertical: 8,
    color: colors.white,
    marginBottom: 32,
  },

  moreButton: {
    height: 52,
    width: "100%",

    paddingLeft: 96,
    paddingRight: 6,

    borderRadius: 60,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#7f807d98",
  },

  moreButtonText: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },

  moreButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 60,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,
  },

  loginModalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(35, 35, 35, 0.45)",
  },

  loginModal: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 26,
    backgroundColor: colors.background,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  modalTitle: {
    fontFamily: "NarnoorBold",
    fontSize: 26,
    lineHeight: 32,
    color: colors.text,
    marginBottom: 8,
  },

  modalText: {
    fontFamily: "System",
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: 22,
  },

  loginButton: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  loginButtonText: {
    fontFamily: "System",
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },

  cancelButton: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
