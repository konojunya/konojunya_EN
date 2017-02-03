var Twit = require('twit')

var T = new Twit({
  consumer_key: process.env.EN_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.EN_TWITTER_CONSUMER_SECRET,
  access_token: process.env.EN_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.EN_TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
})

var params = {screen_name: "konojunya"};

T.get("statuses/user_timeline",params,function(err,tweets,res){
	if(!err){

		var
			user_id = tweets[0].user.id_str,
			option = {follow: user_id};

		var stream = T.stream("statuses/filter",option)
		stream.on("tweet",function(tweet){
			console.log(tweet.text)
		})


	}else{ throw new Error(err) }
})