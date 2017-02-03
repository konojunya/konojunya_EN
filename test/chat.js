var apiai = require('apiai');
var app = apiai(process.env.APIAI_BEARER_TOKEN_DEV);
 
var request = app.textRequest('fox says', {
    sessionId: '123456789'
});
 
request.on('response', function(response) {
    console.log(response.result.fulfillment.speech);
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end();