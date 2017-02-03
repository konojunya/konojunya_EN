var utils = require("./Utils");

utils.getStreamingTweet(function(tweet){
	utils.getTranslateText(tweet.text,function(translated){
		// utils.postTweet(translated)
	})
})