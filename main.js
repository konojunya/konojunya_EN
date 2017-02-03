var utils = require("./Utils");

utils.getStreamingTweet(function(tweet){
	utils.getTranslateText(tweet.text,function(translated){
		if(tweet.entities.media.length > 0){
			utils.postTweetWithMedia(translated,tweet.entities.media)
		}else{
			utils.postTweet(translated)
		}
	})
})