// src/service/mqtt.js
import mqtt from 'mqtt/dist/mqtt.min.js';

let client = null;
const listeners = new Map();

let statusListeners = new Set();
export function onMqttStatus(cb) {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}
function setStatus(s) {
  for (const cb of statusListeners) {
    try { cb(s); } catch {}
  }
}

function matchTopic(topic, filter) {
  if (filter === '#') return true;
  const f = filter.split('/'); const t = topic.split('/');
  for (let i = 0; i < f.length; i++) {
    const seg = f[i];
    if (seg === '#') return true;
    if (seg === '+') { if (!t[i]) return false; continue; }
    if (seg !== t[i]) return false;
  }
  return t.length === f.length;
}

export function connectMqtt({
  url, username, password, clientId,
  keepalive = 30, reconnectPeriod = 3000, clean = true,
}) {
  if (client) return client;

  // Parseia a URL e conecta via host+path (mais confiável no Expo)
  let host, port, path;
  try {
    const u = new URL(url); // ex: wss://<host>:8884/mqtt
    host = u.hostname;
    port = Number(u.port || 8884);
    path = u.pathname || '/mqtt';
  } catch (e) {
    console.warn('[MQTT] URL inválida:', e?.message || e);
    throw e;
  }

  console.log('[MQTT] connecting (host+path):', { host, port, path });
  client = mqtt.connect(`wss://${host}:${port}`, {
    username,
    password,
    clientId: clientId || ('app-' + Date.now()),
    keepalive,
    reconnectPeriod,
    clean,
    path,                 // garante /mqtt
    protocolVersion: 4,   // MQTT 3.1.1
    connectTimeout: 15000,
    resubscribe: true,
  });

  // Timeout de 10s para acusar falta de resposta
  let firstConnectTimer = setTimeout(() => {
    console.warn('[MQTT] Timeout: não conectou em 10s (verifique rede/credenciais/porta 8884)');
  }, 10000);

  client.on('connect', () => {
    clearTimeout(firstConnectTimer);
    console.log('[MQTT] CONNECTED');
    setStatus({ connected: true });
    const filters = Array.from(new Set(Array.from(listeners.values()).map(l => l.filter)));
    if (filters.length) client.subscribe(filters, (err) => err && console.warn('[MQTT] subscribe err:', err));
  });

  client.on('reconnect', () => { console.log('[MQTT] RECONNECT…'); setStatus({ connected: false, reason: 'reconnect' }); });
  client.on('close',     () => { console.log('[MQTT] CLOSE');      setStatus({ connected: false, reason: 'close' }); });
  client.on('offline',   () => { console.log('[MQTT] OFFLINE');    setStatus({ connected: false, reason: 'offline' }); });
  client.on('end',       () => { console.log('[MQTT] END');        setStatus({ connected: false, reason: 'end' }); });
  client.on('error', (e) => {   console.log('[MQTT] ERROR:', e?.message || e); setStatus({ connected: false, reason: 'error', error: String(e?.message || e) }); });

  // Erros do socket TLS/WebSocket (trazem pistas, ex.: 403, handshake TLS, rede)
  try { client.stream?.on?.('error', (e) => console.log('[MQTT] STREAM ERROR:', e?.message || e)); } catch {}

  return client;
}

export function subscribe(filter, cb) {
  if (!client) throw new Error('MQTT não conectado. Chame connectMqtt no App.');
  client.subscribe(filter, (err) => err && console.warn('[MQTT] subscribe error:', err));
  const id = `${filter}::${Math.random().toString(36).slice(2)}`;
  listeners.set(id, { filter, cb });
  return () => {
    listeners.delete(id);
    const still = Array.from(listeners.values()).some(l => l.filter === filter);
    if (!still) try { client.unsubscribe(filter); } catch {}
  };
}

export function publish(topic, message, opts = {}) {
  if (!client) throw new Error('MQTT não conectado.');
  client.publish(topic, typeof message === 'string' ? message : JSON.stringify(message), opts, (err) => {
    if (err) console.warn('[MQTT] publish error:', err);
  });
}

export function getClient() { return client; }
