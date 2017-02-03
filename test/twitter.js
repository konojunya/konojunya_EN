var Twit = require('twit')

var T = new Twit({
  consumer_key: process.env.EN_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.EN_TWITTER_CONSUMER_SECRET,
  access_token: process.env.EN_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.EN_TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
})

T.post('statuses/update', { status: 'Hello World from Node.js' }, function(err, data, response) {
  console.log(data)
})