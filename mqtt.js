import { Buffer } from "buffer";
import mqtt from "mqtt";

global.Buffer = Buffer;

let client;

export const connect = () => {
  const options = {
    host: "195.200.0.241",
    port: 1883,
    protocol: "ws", // importante: RN não suporta TCP direto, use WebSocket
    path: "/mqtt",  // alguns brokers exigem "/mqtt" no caminho do websocket
    clean: true,
    reconnectPeriod: 1000,
  };

  client = mqtt.connect("ws://195.200.0.241:1883/mqtt", options);

  client.on("connect", () => {
    console.log("✅ Conectado ao broker MQTT");
  });

  client.on("error", (err) => {
    console.log("❌ Erro de conexão: ", err);
  });

  client.on("message", (topic, message) => {
    console.log(`📩 Mensagem recebida: ${topic} -> ${message.toString()}`);
  });
};

export const sendMessage = (topic, msg) => {
  if (client && client.connected) {
    client.publish(topic, msg);
    console.log(`📤 Mensagem enviada: ${topic} -> ${msg}`);
  } else {
    console.log("⚠️ Cliente MQTT não conectado");
  }
};
