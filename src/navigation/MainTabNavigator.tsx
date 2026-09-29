import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import ExploreScreen from "../screens/ExploreScreen";
import TripsScreen from "../screens/TripsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { House, Compass, Map, Heart, UserRound } from "lucide-react-native";

import { colors } from "../theme/colors";

import { MainTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primaryMedium,
        tabBarInactiveTintColor: colors.primaryLight,

        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarStyle: {
          position: "absolute",
          height: 76,
          marginBottom: 20,
          marginHorizontal: 16,

          paddingTop: 12,
          paddingBottom: 8,

          backgroundColor: colors.primary,
          borderRadius: 60,
          borderTopWidth: 0,
        },

        tabBarLabelStyle: {
          fontFamily: "Narnoor",
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Home") {
            return (
              <House
                size={size}
                color={color}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            );
          }

          if (route.name === "Explorar") {
            return (
              <Compass
                size={size}
                color={color}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            );
          }

          if (route.name === "Viagens") {
            return (
              <Map
                size={size}
                color={color}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            );
          }

          if (route.name === "Favoritos") {
            return (
              <Heart
                size={size}
                color={color}
                strokeWidth={focused ? 2.4 : 1.8}
              />
            );
          }

          return (
            <UserRound
              size={size}
              color={color}
              strokeWidth={focused ? 2.4 : 1.8}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Explorar" component={ExploreScreen} />

      <Tab.Screen name="Viagens" component={TripsScreen} />

      <Tab.Screen name="Favoritos" component={FavoritesScreen} />

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
