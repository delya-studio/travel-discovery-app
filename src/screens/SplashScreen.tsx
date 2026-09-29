import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { typography } from "../theme/typography";
import { colors } from "../theme/colors";

import { hasCompletedWelcome } from "../data/auth";
import type { RootStackParamList } from "../types/navigation";

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    const checkWelcome = async () => {
      navigation.replace("Welcome");
    };

    const timer = setTimeout(checkWelcome, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Tryple</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMedium,
  },

  logo: {
    ...typography.display,
    textTransform: "uppercase",
    fontSize: 50,
    lineHeight: 70,
    includeFontPadding: true,
    paddingVertical: 8,
    color: colors.white,
  },
});
