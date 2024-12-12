#include <ArduinoJson.h>

// project variables
int a0Val = 0;
int d2Val = 0;
int d2ClickCount = 0;

int prevD2Val = 0;

void sendData() {
  StaticJsonDocument<128> resJson;
  JsonObject data = resJson.createNestedObject("data");
  JsonObject A0 = data.createNestedObject("A0");
  JsonObject D2 = data.createNestedObject("D2");

  A0["value"] = a0Val;
  D2["isPressed"] = d2Val;
  D2["count"] = d2ClickCount;

  String resTxt = "";
  serializeJson(resJson, resTxt);

  Serial.println(resTxt);
}

void setup() {
  // Serial setup
  Serial.begin(9600);
  while (!Serial) {}
}

void loop() {
  // read pins
  a0Val = analogRead(A0);
  d2Val = digitalRead(2);

  // calculate if d2 was clicked
  if (d2Val && d2Val != prevD2Val) {
    d2ClickCount++;
  }

  prevD2Val = d2Val;

  // check if there was a request for data, and if so, send new data
  if (Serial.available() > 0) {
    int byteIn = Serial.read();
    if (byteIn == 0xAB) {
      Serial.flush();
      sendData();
    }
  }

  delay(2);
}
