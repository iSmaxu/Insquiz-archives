// App/screens/ChestsScreen.js
// ==========================================================
//  INSQUIZ - Pantalla de Cofres
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Chest_GetInventory, Chest_Open, Chest_ResetAll } from "../engines/Chest_Engine";

export default function ChestsScreen() {
  const [pending, setPending] = useState([]);
  const [opened, setOpened] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadInventory() {
    setLoading(true);
    try {
      const inv = await Chest_GetInventory();
      setPending(inv.pending || []);
      setOpened(inv.opened || []);
    } catch (e) {
      console.log("❌ Error cargando cofres:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleOpenChest(instanceId) {
    try {
      const result = await Chest_Open(instanceId);
      const { chest, rewards } = result;

      let msg = "";
      if (rewards.xp) msg += `+${rewards.xp} XP\n`;
      if (rewards.coins) msg += `+${rewards.coins} monedas\n`;
      if (!msg) msg = "Recompensas obtenidas.";

      Alert.alert(chest?.name || "Cofre abierto", msg);

      await loadInventory();
    } catch (e) {
      console.log("❌ Error abriendo cofre:", e);
      Alert.alert("Error", "No se pudo abrir el cofre.");
    }
  }

  async function handleResetDev() {
    Alert.alert(
      "Reiniciar cofres",
      "Se borrarán todos los cofres pendientes y abiertos (modo desarrollador).",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: async () => {
            await Chest_ResetAll();
            await loadInventory();
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>🎁 Cofres</Text>
      <Text style={styles.subtitle}>
        Aquí verás tus cofres pendientes por abrir y los que ya has reclamado.
      </Text>

      {/* PENDIENTES */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="gift" size={22} color="#6a0dad" />
          <Text style={styles.cardTitle}>Cofres disponibles</Text>
        </View>

        {loading && <Text style={styles.text}>Cargando cofres...</Text>}

        {!loading && pending.length === 0 && (
          <Text style={styles.text}>No tienes cofres pendientes por abrir.</Text>
        )}

        {!loading &&
          pending.map((inst) => (
            <View key={inst.instanceId} style={styles.chestRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.chestTitle}>{inst.chestId}</Text>
                <Text style={styles.chestSub}>
                  Otorgado: {new Date(inst.grantedAt).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.openBtn}
                onPress={() => handleOpenChest(inst.instanceId)}
              >
                <Text style={styles.openBtnText}>Abrir</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>

      {/* ABIERTOS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="history"
            size={22}
            color="#6a0dad"
          />
          <Text style={styles.cardTitle}>Historial de cofres</Text>
        </View>

        {!loading && opened.length === 0 && (
          <Text style={styles.text}>Aún no has abierto ningún cofre.</Text>
        )}

        {!loading &&
          opened.map((inst) => (
            <View key={inst.instanceId} style={styles.chestRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.chestTitle}>{inst.chestId}</Text>
                <Text style={styles.chestSub}>
                  Otorgado: {new Date(inst.grantedAt).toLocaleString()}
                </Text>
                <Text style={styles.chestSub}>
                  Abierto: {new Date(inst.openedAt).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
      </View>

      {/* BOTÓN DEV */}
      <TouchableOpacity style={styles.devBtn} onPress={handleResetDev}>
        <Text style={styles.devBtnText}>Reiniciar cofres (DEV)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==========================================================
// 🎨 Estilos
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#6a0dad",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginLeft: 6 },
  text: { fontSize: 14, color: "#444", marginTop: 4 },

  chestRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  chestTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
  chestSub: { fontSize: 12, color: "#666" },

  openBtn: {
    backgroundColor: "#6a0dad",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  openBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  devBtn: {
    alignSelf: "center",
    backgroundColor: "#fce4ec",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 20,
  },
  devBtnText: {
    color: "#c2185b",
    fontWeight: "700",
    fontSize: 13,
  },
});
