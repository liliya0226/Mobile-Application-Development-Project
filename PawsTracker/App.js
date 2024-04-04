import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import Intro from "./screens/Intro";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import BottomTab from "./components/BottomTab";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-files/firebaseSetup"; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });
    return unsubscribe; 
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

