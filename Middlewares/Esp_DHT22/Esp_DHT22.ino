#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

// Configuración de WiFi
const char* ssid = "TIGO007998";
const char* password = "B3VX61UM";

// Configuración de MQTT
const char* mqtt_server = "192.168.1.7";  
const int mqtt_port = 1883;  
const char* mqtt_username = "hotel_kamila";
const char* mqtt_password = "hotel-admin-1";
const char* topic = "hotel/room/301";

const char* device_id = "sensor_dth22_301";

// Configuración del sensor DHT
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Cliente WiFi y MQTT (cambiado de WiFiClientSecure a WiFiClient)
WiFiClient espClient;  // Cambiado de WiFiClientSecure a WiFiClient normal
PubSubClient client(espClient);


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
  int retries = 0;
  while (!client.connected() && retries < 5) {
    Serial.print("Intentando conexión MQTT...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    // Intenta conectar
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("¡Conectado!");
    } else {
      Serial.print("Error al conectar, estado: ");
      Serial.print(client.state());
      Serial.println("Reintentando en 5 segundos");
      retries++;
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ; // Espera a que el puerto serie se conecte
  }
  
  Serial.println("Iniciando configuración...");
  dht.begin();
  setup_wifi();
  
  // Ya no necesitamos configurar certificado
  
  // Configurar servidor MQTT
  client.setServer(mqtt_server, mqtt_port);
  
  Serial.println("Configuración completada. Intentando conexión MQTT...");
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Leer valores del sensor cada 10 segundos
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
      Serial.println("¡Error al leer el sensor DHT22!");
      return;
    }

    // Crear el mensaje JSON
    String payload = "{ \"device_id\":\"" + String(device_id) + "\",\"temperatura\": " + String(t, 1) + ", \"humedad\": " + String(h, 1) + "}";

    // Publicar en MQTT
    Serial.print("Publicando: ");
    Serial.println(payload);
    
    if (client.publish(topic, payload.c_str())) {
      Serial.println("Mensaje publicado correctamente");
    } else {
      Serial.println("Error al publicar el mensaje");
    }
  }
}