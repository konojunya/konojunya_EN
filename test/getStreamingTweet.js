var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: process.env.EN_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.EN_TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.EN_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.EN_TWITTER_ACCESS_TOKEN_SECRET
})

var params = {screen_name: "konojunya"};

client.get("statuses/user_timeline",params,function(err,tweets,res){
	if(!err){

		var
			user_id = tweets[0].user.id_str,
			option = {follow: user_id};

		var stream = client.stream("statuses/filter",option)
		stream.on("data",function(tweet){
			console.log(tweet.text)
		})


	}else{ console.log(err) }
})