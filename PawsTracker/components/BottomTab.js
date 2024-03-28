import * as React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Nutri from "../screens/Nutri";
import PooPal from "../screens/PooPal";
import Profile from "../screens/Profile";
import Map from "../screens/Map";
import Weight from "../screens/Weight";
import Header from "./Header";
import AddWeight from "./AddWeight";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Nutri"
      screenOptions={{
        tabBarActiveTintColor: "#ff7f50",
      }}
    >
      <Tab.Screen
        name="Nutri"
        component={Nutri}
        options={{
          tabBarLabel: "Nutri",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="nutrition"
              size={size}
              color={color}
            />
          ),
          header: () => <Header />,
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="PooPal"
        component={PooPal}
        options={{
          tabBarLabel: "PooPal",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="toilet-paper" size={size} color={color} />
          ),
          header: () => <Header />,
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="WeightTab"
        component={WeightStackScreen}
        options={{
          tabBarLabel: "Weight",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="weight" size={size} color={color} />
          ),
          header: () => <Header />,
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const WeightStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Weight"
        component={Weight}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddWeight"
        component={AddWeight}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});
