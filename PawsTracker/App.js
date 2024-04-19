import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import Intro from "./screens/Intro";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import BottomTab from "./components/BottomTab";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-files/firebaseSetup"; 
import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async function (notification) {
   
    return {
      shouldShowAlert: true,
    };
  },
});
const Stack = createNativeStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });
    return unsubscribe; 
  }, []);
  useEffect(() => {
    const sunscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("received listener", notification);
      }
    );
    return () => {
      sunscription.remove();
    };
  }, []);

  useEffect(() => {
    const sunscription = Notifications.addNotificationResponseReceivedListener(
      (notificationResponse) => {
        console.log(
          "received response listener",
          notificationResponse.notification.request.content.data.url
        );
        Linking.openURL(
          notificationResponse.notification.request.content.data.url
        );
      }
    );
    return () => {
      sunscription.remove();
    };
  }, []);

  const AuthStack = (
    <>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
    </>
  );

  const AppStack = (
    <>
      <Stack.Screen name="App" component={BottomTab} />
  
    </>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{ headerShown: false }}
      >
        {userLoggedIn ? AppStack : AuthStack}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

