#include <ArduinoJson.h>

const int potPin = A0; // Potentiometer pin
const int buttonPin = 2; // Button pin

int potValue = 0;
int buttonCount = 0;
bool buttonState = false;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP); // Button with internal pull-up
  Serial.begin(9600);
}

void loop() {
  // Read potentiometer
  potValue = analogRead(potPin);

  // Read button state and count presses
  bool currentButtonState = digitalRead(buttonPin) == LOW;
  if (currentButtonState && !buttonState) {
    buttonCount++;
  }
  buttonState = currentButtonState;

  // Send JSON data over serial
  StaticJsonDocument<128> json;
  JsonObject data = json.createNestedObject("data");
  data["A0"]["value"] = potValue;
  data["D2"]["count"] = buttonCount;

  serializeJson(json, Serial);
  Serial.println(); // Add a newline after each JSON object
  delay(50);
}

