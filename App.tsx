import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialIcons';

import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import OTPScreen from "./src/screens/auth/OTPScreen";
import HomeScreen from "./src/screens/Mainscreens/HomeScreen";
import TokenScreen from "./src/screens/Mainscreens/TokenScreen";
import PaymentScreen from "./src/screens/Mainscreens/PaymentScreen";
import Header from "./src/components/Home/Header";
import TokenDetails from "./src/components/Tokens/TokenHistory";
import TransactionHistory from "./src/components/Payments/PaymentHistory";
import Profile from "./src/screens/Mainscreens/Profile";
import Loader from "./src/components/Missleanous/loader";
import NotificationsScreen from "./src/components/Notifications/NotificationsScreen";
import { colors } from "./src/utils/color";
import AddStudent from "./src/components/Users/AddStudent";
import RemoveStudent from "./src/components/Users/RemoveStudent";
import AllStudent from "./src/components/Users/AllStudent";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 70 },
      tabBarLabelStyle: { marginBottom: 5 },
      tabBarIconStyle: { marginTop: 5 },
      tabBarHideOnKeyboard: true
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="home" size={24} color={focused ? "#00796B" : "#666"} />
        ),
      }}
    />
    <Tab.Screen
      name="Tokens"
      component={TokenScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="paid" size={24} color={focused ? "#00796B" : "#666"} />
        ),
      }}
    />
    <Tab.Screen
      name="Users"
      component={PaymentScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="groups-3" size={30} color={focused ? "#00796B" : "#666"} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }} /> */}

        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ header: () => <Header /> }}
        />
        <Stack.Screen
          name="PaymentHistory"
          component={TransactionHistory}
          options={{ title: 'Transaction History' }}
        />
        <Stack.Screen
          name="Payments"
          component={PaymentScreen}
          options={{
            title: 'Payments',
            headerStyle: { backgroundColor: colors.PRIMARY },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="TokenHistory"
          component={TokenDetails}
          options={{
            title: 'Token Details',
            headerStyle: { backgroundColor: colors.PRIMARY },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: 'User Profile' }}
        />
        <Stack.Screen
          name="notifications"
          component={NotificationsScreen}
          options={{
            title: 'Notifications',
            headerStyle: { backgroundColor: colors.PRIMARY },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="adduser"
          component={AddStudent}
          options={{
            title: 'Add Student',
            headerStyle: { backgroundColor: colors.PRIMARY },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="removeuser"
          component={RemoveStudent}
          options={{
            title: 'Remove Students',
            headerStyle: { backgroundColor: colors.PRIMARY },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="allusers"
          component={AllStudent}
          options={{
            title: 'All Students',
            headerStyle: { backgroundColor: colors.PRIMARY },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Loader"
          component={Loader}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
