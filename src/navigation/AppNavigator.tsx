import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import MainTabNavigator from "./MainTabNavigator";
import ExploreScreen from "../screens/ExploreScreen";
import TripsScreen from "../screens/TripsScreen";
import DestinationScreen from "../screens/DestinationScreen";
import TouristSpotScreen from "../screens/TouristSpotScreen";
import TouristSpotsScreen from "../screens/TouristSpotsScreen";
import TripDetailsScreen from "../screens/TripDetailsScreen";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Main" component={MainTabNavigator} />

      <Stack.Screen name="Explore" component={ExploreScreen} />

      <Stack.Screen name="Trips" component={TripsScreen} />

      <Stack.Screen name="Destination" component={DestinationScreen} />

      <Stack.Screen name="TouristSpot" component={TouristSpotScreen} />

      <Stack.Screen name="TouristSpots" component={TouristSpotsScreen} />

      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
    </Stack.Navigator>
  );
}
