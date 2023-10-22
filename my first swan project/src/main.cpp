#include <Arduino.h>
#include <Notecard.h>
#include <NotecardPseudoSensor.h>

int getSensorInterval();

#define usbSerial Serial
#define productUID "com.gmail.vincent.tsn:b2gapp1"

using namespace blues;

Notecard notecard;
NotecardPseudoSensor sensor(notecard);

int level;
int back_door_state;
int front_door_state;

// the setup function runs once when you press reset or power the board
void setup()
{
  delay(2500);
  usbSerial.begin(115200);
  notecard.begin();
  notecard.setDebugOutputStream(usbSerial);
  J *req = notecard.newRequest("hub.set");
  JAddStringToObject(req, "product", productUID);
  JAddStringToObject(req, "mode", "continuous");
  JAddBoolToObject(req, "sync", true);
  notecard.sendRequest(req);

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PE11, OUTPUT);
  pinMode(PE9, INPUT_PULLUP);
  level = LOW;
  back_door_state = false;
}

// the loop function runs over and over again forever
void loop()
{
  level = !level;   // toggle level
  digitalWrite(LED_BUILTIN, level);
  // digitalWrite(PE11, level);

  // read led1 and actuate

  
  J *req0 = notecard.newRequest("note.get");
  JAddStringToObject(req0, "file", "my.db");
  JAddStringToObject(req0, "note", "led1");

  J* res = notecard.requestAndResponse(req0);
  J* body = JGetObject(res, "body");
  usbSerial.println(JGetString(body, "state"));

  if (strcmp(JGetString(body, "state"), "on") == 0) {
    // on led
    digitalWrite(PE11, HIGH);
  } else {
    /// off led
    digitalWrite(PE11, LOW);
  }



  // read sensors data

  front_door_state = digitalRead(PE9);
  back_door_state = !back_door_state;   // toggle state

  float temperature = sensor.temp();
  float humidity = sensor.humidity();

  usbSerial.print("Temperature = ");
  usbSerial.print(temperature);
  usbSerial.println(" *C");
  usbSerial.print("Humidity = ");
  usbSerial.print(humidity);
  usbSerial.println(" %");

  J *req = notecard.newRequest("note.add");
  if (req != NULL)
  {
    JAddStringToObject(req, "file", "sensors.qo");
    JAddBoolToObject(req, "sync", true);
    J *body = JAddObjectToObject(req, "body");
    if (body)
    {
      JAddNumberToObject(body, "temp", temperature);
      JAddNumberToObject(body, "humidity", humidity);
      JAddBoolToObject(body, "front_door_status", front_door_state);
      JAddBoolToObject(body, "back_door_status", back_door_state);
    }
    notecard.sendRequest(req);
  }

  int sensorIntervalSeconds = getSensorInterval();
  usbSerial.print("Delaying ");
  usbSerial.print(sensorIntervalSeconds);
  usbSerial.println(" seconds");
  delay(sensorIntervalSeconds * 1000);
}

// This function assumes you’ll set the reading_interval environment variable to
// a positive integer. If the variable is not set, set to 0, or set to an invalid
// type, this function returns a default value of 60.
int getSensorInterval() {
  int sensorIntervalSeconds = 60;
  J *req = notecard.newRequest("env.get");
  if (req != NULL) {
      JAddStringToObject(req, "name", "reading_interval");
      J* rsp = notecard.requestAndResponse(req);
      int readingIntervalEnvVar = atoi(JGetString(rsp, "text"));
      if (readingIntervalEnvVar > 0) {
        sensorIntervalSeconds = readingIntervalEnvVar;
      }
      notecard.deleteResponse(rsp);
  }
  return sensorIntervalSeconds;
}

