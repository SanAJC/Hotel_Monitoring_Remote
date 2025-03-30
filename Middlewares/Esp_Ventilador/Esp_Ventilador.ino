#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

// Configuración de WiFi
const char* ssid = "TIGO007998";
const char* password = "B3VX61UM";

// Configuración de MQTT
const char* mqtt_server = "192.168.1.7";
const int mqtt_port = 8883;
const char* mqtt_username = "hotel_kamila";
const char* mqtt_password = "hotel-admin-1";
const char* topic = "hotel/rooms";
const char* room_id = "301";
const char* device_id = "ventilador";

const char* relay_topic = "hotel/room/301/relay/ventilador";


static const char *root_ca PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIEPjCCAyagAwIBAgIUZ1O9Md9ZXGRLQwONs69EzAUcuGQwDQYJKoZIhvcNAQEL
BQAwZDELMAkGA1UEBhMCQ08xEjAQBgNVBAgMCU1hZ2RhbGVuYTEUMBIGA1UEBwwL
U2FudGEgTWFydGExFTATBgNVBAoMDEhvdGVsIEthbWlsYTEUMBIGA1UEAwwLMTky
LjE2OC4xLjcwHhcNMjUwMzE3MDUwNTM0WhcNMzUwMzE1MDUwNTM0WjBkMQswCQYD
VQQGEwJDTzESMBAGA1UECAwJTWFnZGFsZW5hMRQwEgYDVQQHDAtTYW50YSBNYXJ0
YTEVMBMGA1UECgwMSG90ZWwgS2FtaWxhMRQwEgYDVQQDDAsxOTIuMTY4LjEuNzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIJPl8wwO6HH/E7qzCc7Ufsj
tRv3dbX1T1wYc+nTa5nBGp0bcGyS6rQiArJpUvGAwUlQbUV005GAc0evwtiLeFzX
r4TNVq2L2/+g6DSMlEJDf7B415vbk4QTEHofh/5B8bacgQwgCQ9vbtoQWGrKBHVo
lWUgdCvU4rcKvp5ej4mT55VUvDvWvylD8XOIuka2dSL6YXS938bLHEVBDS6vZ0WX
Hrd2T2B9t84ooQUihIdrnb/dxrbOF/44VTacxQ4YBB/aiIgR6oELE9X9qxHr1Avk
VJNsoelhKc2yH1ZygxCPu69APecNwV70Ws6WJAlDaFbrCzPgv3evk/N5n1jCNR8C
AwEAAaOB5zCB5DAdBgNVHQ4EFgQUIb1fdyCWCLVilA+H9US22zKcmhgwgaEGA1Ud
IwSBmTCBloAUIb1fdyCWCLVilA+H9US22zKcmhihaKRmMGQxCzAJBgNVBAYTAkNP
MRIwEAYDVQQIDAlNYWdkYWxlbmExFDASBgNVBAcMC1NhbnRhIE1hcnRhMRUwEwYD
VQQKDAxIb3RlbCBLYW1pbGExFDASBgNVBAMMCzE5Mi4xNjguMS43ghRnU70x31lc
ZEtDA42zr0TMBRy4ZDAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAN
BgkqhkiG9w0BAQsFAAOCAQEAYoiJTlHI50mhctxguzxnKfPuQn1pWmuexi7IcK6v
7vTAW2WSUZC61fplz5zGMq62sAfZTtKS75DqVJ8idaZHakNZ1cv9qm+IMmQbR4eV
3CT7cSBSZgpf8cc9CaTwjRVr1fE0siwr3KqKxFaEzLcfhBon9CwLFtBz2Rv+msB9
5eovDTjlkT8Z6hi/mEktEug4O4JO3MmG8lqpONzWHOiti2CN+Qckmrn0nMBDSf0A
gycyWjwEplhDAGtELQyuNjRuHrI7IYCzspVBkRDKgT08QnQGaF5qSK+ZR/I2BRPX
9ibL8h47QuQChUVy6weusbKvh2RuhQvWKjFw2uorERoJbg==
-----END CERTIFICATE-----
)EOF";

// Cliente WiFi y MQTT
WiFiClientSecure espClient; 
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
  espClient.setCACert(root_ca); 
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
    
    String payload = String("{\"room_id\":\"") + String(room_id) +
    String("\", \"device_id\":\"") + String(device_id) +
    String("\", \"estado_rele\":\"") + String(relayOn ? "ON" : "OFF") +
    String("\", \"potencia_actual\":") + String(potenciaActual, 1) +
    String(", \"consumo_acumulado\":") + String(acumulado, 3) +
    String("}");
    
    Serial.print("Publicando: ");
    Serial.println(payload);
    
    if (client.publish(topic, payload.c_str())) {
      Serial.println("Publicado correctamente");
    } else {
      Serial.println("Error al publicar");
    }
  }
}
