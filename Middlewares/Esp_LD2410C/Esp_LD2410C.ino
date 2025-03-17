#include <WiFi.h>
#include <PubSubClient.h>
#include <ld2410.h>

// Configuración de WiFi
const char* ssid = "TIGO007998";
const char* password = "B3VX61UM";

// Configuración MQTT (ajusta según tu broker)
const char* mqtt_server = "192.168.1.7";
const int mqtt_port = 1883;
const char* mqtt_username = "hotel_kamila";
const char* mqtt_password = "hotel-admin-1";
const char* topic = "hotel/room/301"; 

// Configuración del sensor LD2410C
#define RX_PIN 16  // Conectar TX del sensor aquí
#define TX_PIN 17  // Conectar RX del sensor aquí
ld2410 radar;
HardwareSerial radarSerial(2);  // Usamos UART2 del ESP32

WiFiClient espClient;
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
  radarSerial.begin(256000, SERIAL_8N1, RX_PIN, TX_PIN); // Baud rate del LD2410C
  
  if (!radar.begin(radarSerial)) {
    Serial.println("¡Error al iniciar el sensor LD2410C!");
    while (1);
  }
  Serial.println("Sensor LD2410C iniciado");

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  static unsigned long lastMsg = 0;
  if (millis() - lastMsg > 2000) {  // Envía datos cada 2 segundos
    lastMsg = millis();
    
    radar.read();
    String payload = String("{") +
      "\"presencia\":" + String(radar.presenceDetected() ? "true" : "false") + "," +
      "\"movimiento\":" + String(radar.movingTargetDetected() ? "true" : "false") + "," +
      "\"distancia\":" + String(radar.stationaryTargetDistance()) +
      "}";

    Serial.print("Publicando: ");
    Serial.println(payload);
    
    if (client.publish(topic, payload.c_str())) {
      Serial.println("Mensaje publicado");
    } else {
      Serial.println("Error al publicar");
    }
  }
}

