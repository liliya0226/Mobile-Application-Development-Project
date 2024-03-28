import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DogProvider } from "../context-files/ DogContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Nutri from "../screens/Nutri";
import PooPal from "../screens/PooPal";
import Profile from "../screens/Profile";
import Map from "../screens/Map";
import Weight from "../screens/Weight";
import Header from "./Header";
import PressableButton from "./PressableButton";
import { AntDesign } from "@expo/vector-icons";
import AddReminderScreen from "../screens/AddReminderScreen";
const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <DogProvider>
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
          name="AddReminder"
          component={AddReminderScreen}
          options={{
            tabBarLabel: "Add Reminder",
            tabBarButton: () => null,
            header: () => null,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Weight"
          component={Weight}
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
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
            // headerShown: false,
            headerRight: () => {
              return (
                <PressableButton
                  onPressFunction={() => {
                    try {
                      signOut(auth);
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  <AntDesign name="logout" size={24} color="white" />
                </PressableButton>
              );
            },
          }}
        />
      </Tab.Navigator>
    </DogProvider>
  );
}

const styles = StyleSheet.create({});
