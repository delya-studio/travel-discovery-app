import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { hasCompletedWelcome } from "../data/auth";
import type { RootStackParamList } from "../types/navigation";

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    const checkWelcome = async () => {
      const completed = await hasCompletedWelcome();

      if (completed) {
        navigation.replace("Main", {
          screen: "Home",
        });
      } else {
        navigation.replace("Welcome");
      }
    };

    const timer = setTimeout(checkWelcome, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TRIPLE</Text>
      <Text>SPLASH SCREEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 40,
    fontWeight: "bold",
  },
});
