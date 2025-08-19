import { Buffer } from "buffer";
import mqtt from "mqtt";

global.Buffer = Buffer;

let client;

export const connect = () => {
  const options = {
    username: "cetem",
    password: "YpEApUJp2NpsSp2",
    clean: true,
    reconnectPeriod: 1000,
  };
    


  client = mqtt.connect("wss://315eb8499cef46ee9d6aa3afd0bdf5dd.s1.eu.hivemq.cloud:8884/mqtt", options);

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
