//import * as NotehubJs from "@blues-inc/notehub-js";
//let apiInstance = new NotehubJs.AuthorizationApi();

const NotehubJs = require("@blues-inc/notehub-js");
const apiInstance = new NotehubJs.AuthorizationApi();

let loginRequest = {"username":"vincent.tsn@gmail.com","password":"Vincen*1234&3607"}; // LoginRequest | 

const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;

  apiInstance.login(loginRequest).then(
    (data) => {
      logger.debug(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );

      logger.debug(data, 'api-key data');   // data.session_token
      res.sendStatus(200);

    },
    (error) => {
      logger.debug(error, 'api-key error');
      //console.error(error);
    }
  );


});

module.exports = router;
