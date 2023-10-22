const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

const NotehubJs = require("@blues-inc/notehub-js");
const defaultClient = NotehubJs.ApiClient.instance;

const apiInstance = new NotehubJs.AuthorizationApi();
let loginRequest = {"username":"vincent.tsn@gmail.com","password":"Vincen*1234&3607"}; // LoginRequest | 

// Configure API key authorization: api_key
let api_key = defaultClient.authentications["api_key"];

let noteApiInstance = new NotehubJs.NotesApi();
let projectUID = "app:0e38afce-dc1e-4003-ae18-d0b114e98b91"; // String |
let deviceUID = "dev:867730051243750"; // String |
let notefileID = "my.db"; // String |
let noteID = "led1"; // String |
let note = new NotehubJs.Note(); // Note | Body or payload of note to be added to the device

function  turnon(logger) {
  note.Body = { "state": "on" }

  apiInstance.login(loginRequest).then(
    (data) => {
      logger.debug(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );

      logger.debug(data, 'api-key data');   // data.session_token
      //res.sendStatus(200);
      api_key.apiKey = data.session_token;
      //api_key.apiKey = "YOUR API KEY";
      noteApiInstance
        .handleNoteUpdate(projectUID, deviceUID, notefileID, noteID, note)
        .then(
          () => {
            logger.debug("API called successfully.", 'note-update');
          },
          (error) => {
            logger.debug(error, 'note-update error');
            //console.error(error);
          }
        );

    },
    (error) => {
      logger.debug(error, 'api-key error');
      //console.error(error);
    }
  );  
}

function  turnoff(logger) {
  note.Body = { "state": "off" }

  apiInstance.login(loginRequest).then(
    (data) => {
      logger.debug(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );

      logger.debug(data, 'api-key data');   // data.session_token
      //res.sendStatus(200);
      api_key.apiKey = data.session_token;
      //api_key.apiKey = "YOUR API KEY";
      noteApiInstance
        .handleNoteUpdate(projectUID, deviceUID, notefileID, noteID, note)
        .then(
          () => {
            logger.debug("API called successfully.", 'note-update');
          },
          (error) => {
            logger.debug(error, 'note-update error');
            //console.error(error);
          }
        );

    },
    (error) => {
      logger.debug(error, 'api-key error');
      //console.error(error);
    }
  );  
}

router.post('/ask', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /smart-home/ask');
  try {
    const app = new WebhookResponse();
    app 
      .pause({length: 1.5})
      .gather({
	actionHook: '/smart-home/process',
	input: [ 'digits', 'speech' ],
	finishOnKey: '#',
	numDigits: 1,
	timeout: 20,
	say: {
          text: 'Please give a command like turn on light, turn off light or check status.'
        }
      });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/process', (req, res) => {
  const {logger} = req.app.locals;
  const payload = req.body;
  logger.debug({payload: req.body}, 'POST /smart-home/process');
  try {
    let destination;
    if (payload.speech && payload.speech.alternatives.length) {
      const result = payload.speech.alternatives[0];
      logger.debug(result);
      destination = result.transcript;
    }
    if (destination) {
      const app = new WebhookResponse();
      if (destination == "check status") {
      let text = '<speak>You have choosen to check status.  the temperature is 45 degree and the light is off</speak>';
      app
        .say({text});
    } else if (destination == "turn on light") {
      let text = '<speak>You have choosen to turn on the light.  now turning on light.</speak>';
      app
        .say({text});

      turnon(logger);

    } else {
      let text = '<speak>You have choosen to turn off the light.  turning off light</speak>';
      app
        .say({text});

      turnoff(logger);
    }
	// .dial({
  //         target: [
  //           {
	//       type: 'phone',
	//       number: `1${destination}`
	//     }
	//   ]
	// });

      return res.status(200).json(app);
    }

    //res.status(200).json(app);
    res.sendStatus(200);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;
