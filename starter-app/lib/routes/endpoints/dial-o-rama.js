const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/collect', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /dial-o-rama/collect');
  try {
    const app = new WebhookResponse();
    app
      .gather({
	actionHook: '/dial-o-rama/process',
	input: [ 'digits', 'speech' ],
	finishOnKey: '#',
	numDigits: 10,
	timeout: 20,
	say: {
          text: 'Please say or input the 10-digit phone number you would like'
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
  logger.debug({payload: req.body}, 'POST /dial-o-rama/process');
  try {
    let destination;
    if (payload.speech && payload.speech.alternatives.length) {
      const result = payload.speech.alternatives[0];
      logger.debug(result);
      if (result.confidence > 0.8) {
	const number = [...result.transcript].filter((c) => /\d/.test(c)).join('');
        logger.debug(number);
	if (10 === number.length) destination = number;
      }
    } 
    else if (payload.digits && 10 === payload.digits) {
      destination = payload.digits;
    }

    if (destination) {
      const app = new WebhookResponse();

      app
        .say({text: 'Please hold while we connect your call'})
	.dial({
          target: [
            {
	      type: 'phone',
	      number: `1${destination}`
	    }
	  ]
	});

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
