import 'react-native-get-random-values';
import process from 'process';
import { Buffer } from 'buffer';
if (typeof global.process === 'undefined') global.process = process;
if (typeof global.Buffer === 'undefined') global.Buffer = Buffer;

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { connect } from "mqtt/dist/mqtt";

// ==== CONFIGURAÇÃO MQTT (vem do app.json) ====
const MQTT_URL = "wss://99ad12f47441431f928caa2bc6834a6a.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USER = Constants.expoConfig?.extra?.mqttUser || "usuario_padrao";
const MQTT_PASS = Constants.expoConfig?.extra?.mqttPass || "senha_padrao";
const MQTT_TOPIC = "cetem/alarmes/#";

export default class Resumo extends Component {
  state = {
    alarms: [],
    refreshing: false,
    connected: false,
  };

  componentDidMount() {
    this.mqttConnect();
  }

  componentWillUnmount() {
    try { this.mqttClient?.end(true); } catch {}
  }

  mqttConnect = () => {
    const options = {
      clientId: "expo-mobile-" + Date.now(),
      username: MQTT_USER,
      password: MQTT_PASS,
      clean: true,
      reconnectPeriod: 3000,
      keepalive: 30,
    };

    this.mqttClient = connect(MQTT_URL, options);

    this.mqttClient.on("connect", () => {
      this.setState({ connected: true });
      this.mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (err) console.warn("Erro ao assinar tópico:", err);
      });
    });

    this.mqttClient.on("close", () => this.setState({ connected: false }));
    this.mqttClient.on("reconnect", () => this.setState({ connected: false }));
    this.mqttClient.on("error", (e) => console.warn("MQTT error:", e?.message || e));

    this.mqttClient.on("message", (topic, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        const alarm = {
          id: String(msg.id ?? Date.now()),
          ts: msg.ts ?? Date.now(),
          system: msg.system ?? inferSystemFromTopic(topic),
          title: msg.title ?? "(sem título)",
          severity: msg.severity ?? "medium",
        };
        this.setState((p) => ({ alarms: [alarm, ...p.alarms] }));
      } catch {
        const alarm = {
          id: String(Date.now()),
          ts: Date.now(),
          system: inferSystemFromTopic(topic),
          title: payload.toString(),
          severity: "medium",
        };
        this.setState((p) => ({ alarms: [alarm, ...p.alarms] }));
      }
    });
  };

  addMockAlarm = () => {
    const severities = ["low", "medium", "high", "critical"];
    const systems = ["Elétrica", "Incêndio", "Hidráulica", "HVAC", "Utilidades"];
    const titles = [
      "Tensão fora da faixa",
      "Pressão baixa detectada",
      "Temperatura elevada",
      "Falha de comunicação",
      "Sobrecorrente",
      "Bomba 01 em Alarme",
    ];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const alarm = {
      id: String(Date.now()),
      ts: Date.now(),
      system: pick(systems),
      title: pick(titles),
      severity: pick(severities),
    };
    this.setState((p) => ({ alarms: [alarm, ...p.alarms] }));
  };

  renderAlarm = ({ item }) => {
    const color = colorBySeverity(item.severity);
    const when = formatTime(item.ts);
    return (
      <View style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.cardHeader}>
          <View style={styles.inline}>
            <Ionicons name="warning-outline" size={22} color={color} style={{ marginRight: 8 }} />
            <Text style={[styles.title, { color }]}>{item.system}</Text>
          </View>
          <Text style={styles.time}>{when}</Text>
        </View>
        <Text style={styles.message}>{item.title}</Text>
      </View>
    );
  };

  renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <Ionicons name="notifications-off-outline" size={28} color="#777" />
      <Text style={styles.emptyText}>Sem alarmes no momento</Text>
      <TouchableOpacity onPress={this.addMockAlarm} style={styles.testBtn}>
        <Text style={styles.testBtnText}>Adicionar alarme de teste</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { alarms, refreshing, connected } = this.state;
    return (
      <View style={styles.container}>
        {/* Status da conexão */}
        <View style={styles.statusBar}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: connected ? "#34c759" : "#ff3b30" },
            ]}
          />
          <Text style={styles.statusText}>
            {connected ? "Conectado ao MQTT" : "Reconectando..."}
          </Text>
        </View>

        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          renderItem={this.renderAlarm}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} />}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
    );
  }
}

// ==== helpers ====

function inferSystemFromTopic(topic) {
  const parts = String(topic).split("/");
  return parts[2] || "Desconhecido";
}
function colorBySeverity(sev) {
  switch (sev) {
    case "critical": return "#ff3b30";
    case "high":     return "#ff9f0a";
    case "medium":   return "#ffd60a";
    default:         return "#34c759";
  }
}
function pad(n) { return String(n).padStart(2, "0"); }
function formatTime(ts) {
  const d = new Date(ts || Date.now());
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ==== estilos ====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
  statusBar: { flexDirection: "row", alignItems: "center", padding: 16 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { color: "#a1a1a1", fontSize: 12 },
  card: {
    width: "100%",
    minHeight: 70,
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  inline: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  title: { fontSize: 16, fontWeight: "800" },
  time: { color: "#a1a1a1", fontSize: 12 },
  message: { color: "#e5e5ea", fontSize: 15, fontWeight: "600" },
  emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: 48 },
  emptyText: { color: "#e3e3e3ff", marginTop: 8, fontSize: 14 },
  testBtn: { marginTop: 16, backgroundColor: "#2d2d2d", padding: 10, borderRadius: 10 },
  testBtnText: { color: "#ddd", fontWeight: "700" },
});
