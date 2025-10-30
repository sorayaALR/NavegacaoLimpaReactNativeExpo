import 'react-native-get-random-values';
import process from 'process';
import { Buffer } from 'buffer';
if (!global.process) global.process = process;
if (!global.Buffer) global.Buffer = Buffer;

import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

// 🚀 Conexão MQTT global
import { connectMqtt } from "./src/service/mqtt";


// Páginas
import Eletrica from "./src/pages/eletrica";
import Hidraulica from "./src/pages/hidraulica";
import Resumo from "./src/pages/resumo";
import Incendio from "./src/pages/incendio";
import Hvac from "./src/pages/hvac";
import Utilidades from "./src/pages/utilidades";

const Tab = createMaterialTopTabNavigator();

export default class App extends Component {
componentDidMount() {
connectMqtt({
  url: 'wss://99ad12f47441431f928caa2bc6834a6a.s1.eu.hivemq.cloud:8884/mqtt',
  username: 'SEU_USUARIO_MQTT',
  password: 'SUA_SENHA_MQTT',
  clientId: 'expo-mobile-' + Date.now(),
});
}

  render() {
    const topoHeight = 80;
    const statusBarOffset = Platform.OS === "ios" ? 40 : 20;

    return (
      <View style={styles.container}>
        {/* TOPO FIXO */}
        <View style={[styles.topo, { top: statusBarOffset }]}>
          <Text style={styles.topoTitulo}>CETEM TECNOLOGIA</Text>
          <Image source={require("./assets/logo.png")} style={styles.logo} />
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <NavigationContainer>
          <SafeAreaView
            style={[styles.conteudo, { marginTop: topoHeight + statusBarOffset }]}
            edges={["top", "left", "right"]}
          >
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarShowIcon: true,
                tabBarScrollEnabled: true,
                tabBarIndicatorStyle: { height: 3, backgroundColor: "tomato" },
                tabBarStyle: { backgroundColor: "#333" },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "#aaa",
                tabBarLabelStyle: { fontWeight: "600", fontSize: 18 },
                tabBarItemStyle: { width: 100 },
                tabBarIcon: ({ color }) => {
                  let name = "ellipse";
                  if (route.name === "Resumo") name = "document-text-outline";
                  if (route.name === "Incêndio") name = "flame-outline";
                  if (route.name === "Elétrica") name = "flash-outline";
                  if (route.name === "Hidráulica") name = "water-outline";
                  if (route.name === "HVAC") name = "snow-outline";
                  if (route.name === "Utilidades") name = "construct-outline";
                  return <Ionicons name={name} size={18} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Resumo" component={Resumo} />
              <Tab.Screen name="Incêndio" component={Incendio} />
              <Tab.Screen name="Elétrica" component={Eletrica} />
              <Tab.Screen name="Hidráulica" component={Hidraulica} />
              <Tab.Screen name="HVAC" component={Hvac} />
              <Tab.Screen name="Utilidades" component={Utilidades} />
            </Tab.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
  topo: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    marginTop: 10,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  topoTitulo: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
  conteudo: { flex: 1 },
});
