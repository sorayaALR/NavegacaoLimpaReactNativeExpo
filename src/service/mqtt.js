import { Buffer } from "buffer";
import mqtt from "mqtt";

global.Buffer = Buffer;

let client;

/**
 * Conecta ao broker MQTT e define um callback para mensagens recebidas
 * @param {function} onMessageCallback - Função chamada quando chega uma mensagem (topic, message)
 */
export const connect = (onMessageCallback) => {
  const options = {
    username: "",
    password: "",
    clean: true,
    reconnectPeriod: 1000,
  };

  client = mqtt.connect(
    //"wss://99ad12f47441431f928caa2bc6834a6a.s1.eu.hivemq.cloud:8884/mqtt",
    "wss://195.200.0.241:1883/mqtt",
    options
  );

  client.on("connect", () => {
    console.log("✅ Conectado ao broker MQTT");

    // inscreve em um tópico padrão (exemplo: "teste")
    client.subscribe("teste", (err) => {
      if (!err) {
        console.log("📩 Inscrito no tópico: teste");
      } else {
        console.log("❌ Erro ao se inscrever: ", err);
      }
    });
  });

  client.on("error", (err) => {
    console.log("❌ Erro de conexão: ", err);
  });

  client.on("message", (topic, message) => {
    console.log(`📩 Mensagem recebida: ${topic} -> ${message.toString()}`);

    // repassa a mensagem para a tela
    if (onMessageCallback) {
      onMessageCallback(topic, message.toString());
    }
  });
};

/**
 * Publica mensagem em um tópico
 */
export const sendMessage = (topic, msg) => {
  if (client && client.connected) {
    client.publish(topic, msg);
    console.log(`📤 Mensagem enviada: ${topic} -> ${msg}`);
  } else {
    console.log("⚠️ Cliente MQTT não conectado");
  }
};
