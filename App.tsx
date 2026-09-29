import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    Narnoor: require("./assets/fonts/Narnoor-Regular.ttf"),
    NarnoorBold: require("./assets/fonts/Narnoor-Bold.ttf"),
    NarnoorSemiBold: require("./assets/fonts/Narnoor-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
