const router = require('express').Router();

router.use('/call-status', require('./call-status'));
router.use('/hello-world', require('./tts-hello-world'));
router.use('/dial-time', require('./dial-time'));
router.use('/dial-o-rama', require('./dial-o-rama'));
router.use('/api-key', require('./api-key'));
router.use('/note-update', require('./note-update'));
router.use('/smart-home', require('./smart-home'));

module.exports = router;
