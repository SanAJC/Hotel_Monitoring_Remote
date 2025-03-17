#include <WiFi.h>
#include <PubSubClient.h>

// Configuración de WiFi
const char* ssid = "TIGO007998";
const char* password = "B3VX61UM";

// Configuración de MQTT
const char* mqtt_server = "192.168.1.7";
const int mqtt_port = 1883;
const char* mqtt_username = "hotel_kamila";
const char* mqtt_password = "hotel-admin-1";
const char* topic = "hotel/room/301";
const char* relay_topic = "hotel/room/301/relay";

const char* device_id = "sensor_ventilador_301";

// Cliente WiFi y MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Variables de simulación
bool relayOn = true;           
float acumulado = 0.0;         
const unsigned long intervaloMs = 2000;  


void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Mensaje recibido [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);
  
  if (String(topic) == relay_topic) {
    if (message.equalsIgnoreCase("ON")) {
      relayOn = true;
      Serial.println("Relé activado");
    } else if (message.equalsIgnoreCase("OFF")) {
      relayOn = false;
      Serial.println("Relé desactivado");
    }
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Conectado a MQTT");
      client.subscribe(relay_topic);
    } else {
      Serial.print("Falló, rc=");
      Serial.print(client.state());
      Serial.println(" Intentando de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  randomSeed(esp_random()); 
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Cada 2 segundos se simula el consumo
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg >= intervaloMs) {
    lastMsg = now;
    
    float potenciaActual = 0.0;
    float consumoIntervalo = 0.0;
    
    if (relayOn) {
      potenciaActual = random(550, 651) / 10.0;
      // Energía en Wh consumida en 2 segundos: (potencia * tiempo) / 3600
      consumoIntervalo = potenciaActual * (intervaloMs / 1000.0) / 3600.0;
      acumulado += consumoIntervalo;
    } else {
      potenciaActual = 0.0;
      consumoIntervalo = 0.0;
    }
    
    // Construir el mensaje JSON sin enviar el consumoIntervalo
    String payload = "{\"device_id\":\"" + String(device_id) + "\", ";
    payload += "\"estado_rele\":\"" + String(relayOn ? "ON" : "OFF") + "\", ";
    payload += "\"potencia_actual\":" + String(potenciaActual, 1) + ", ";
    payload += "\"consumo_acumulado\":" + String(acumulado, 3) + "}";
    
    Serial.print("Publicando: ");
    Serial.println(payload);
    
    if (client.publish(topic, payload.c_str())) {
      Serial.println("Publicado correctamente");
    } else {
      Serial.println("Error al publicar");
    }
  }
}
