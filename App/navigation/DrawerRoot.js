// App/navigation/DrawerRoot.js
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "../screens/HomeScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import UserSettingsScreen from "../screens/UserSettingsScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("license_key");
    props.navigation.reset({
      index: 0,
      routes: [{ name: "LicenseGate" }],
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/avatar-user.png")}
          style={styles.avatar}
        />
        <Text style={styles.profileName}>Usuario InsQUIZ</Text>
        <Text style={styles.profileEmail}>Estudiante</Text>
      </View>

      <View style={{ flex: 1 }}>
        <DrawerItem
          label="Pantalla principal"
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("Home")}
        />
        <DrawerItem
          label="Logros"
          icon={({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("Achievements")}
        />
        <DrawerItem
          label="Configuración"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate("UserSettings")}
        />
      </View>

      <DrawerItem
        label="Cerrar sesión / Cambiar licencia"
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" size={size} color="#b91c1c" />
        )}
        labelStyle={{ color: "#b91c1c", fontWeight: "700" }}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerRoot() {
  return (
    <Drawer.Navigator
      id="DrawerRoot"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        drawerStyle: { backgroundColor: "#f9f9f9", width: 270 },
        headerStyle: { backgroundColor: "#6a0dad" },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: "#ede0ff",
        drawerActiveTintColor: "#6a0dad",
        drawerInactiveTintColor: "#333",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Pantalla principal",
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: "Logros",
          drawerIcon: ({ color }) => (
            <Ionicons name="trophy-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UserSettings"
        component={UserSettingsScreen}
        options={{
          title: "Configuración",
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    paddingVertical: 25,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  profileEmail: {
    fontSize: 13,
    color: "#888",
  },
});
