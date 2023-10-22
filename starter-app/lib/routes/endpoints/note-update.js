//import * as NotehubJs from "@blues-inc/notehub-js";
//let defaultClient = NotehubJs.ApiClient.instance;
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
note.Body = { "state": "on" }

const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;

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

});

module.exports = router;
