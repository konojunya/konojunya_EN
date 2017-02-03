var
	apiai = require('apiai'),
	Twitter = require('twitter'),
	http = require('http'),
	https = require('https'),
	qs = require('querystring');


var Utils = function(){}

/********************
	Access Token Set.	
********************/

/***
 *	getTwitterToken
 *
 *	@return { object } T
 */
Utils.prototype._getTwitterToken = function(){
	var client = new Twitter({
		consumer_key: process.env.EN_TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.EN_TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.EN_TWITTER_ACCESS_TOKEN,
		access_token_secret: process.env.EN_TWITTER_ACCESS_TOKEN_SECRET
	})
	return client
}

/***
 *	getMSTranslateAccessToken
 *
 *	@return { string }
 */
Utils.prototype._getMSTranslateAccessToken = function(fn){
	var body = '';
  var data = {
      'client_id': process.env.MS_TRANSLATE_ID,
      'client_secret': process.env.MS_TRANSLATE_SECRET,
      'scope': 'http://api.microsofttranslator.com',
      'grant_type': 'client_credentials'
  };

  var req = https.request({
      host: 'datamarket.accesscontrol.windows.net',
      path: '/v2/OAuth2-13',
      method: 'POST'
  }, function(res){
      res.setEncoding('utf8');
      res.on('data', function(chunk){
          body += chunk;
      }).on('end', function(){
          var resData = JSON.parse(body);
          fn(resData.access_token)
      });
  })
  .on('error', function(err){
  	// logger.fatal(err);
  	throw err
  });

  req.write(qs.stringify(data));
  req.end();
}

/***
 *	getApiaiToken
 *
 *	@return { string }
 */
Utils.prototype._getApiaiToken = function(){
	return apiai(process.env.APIAI_BEARER_TOKEN_DEV);
}

/*****************
	Translate API 		
*****************/

/***
 *	translate
 *	Jaoanese to English
 *
 *	@params { string } token
 *	@params { string } text
 *	@return { string } text
 */
Utils.prototype._translate = function(token, text,callback){
	var options = 'from=ja&to=en&text='+qs.escape(text)+'&oncomplete=translated';
	var body = '';
	var req = http.request({
		host: 'api.microsofttranslator.com',
		path: '/V2/Ajax.svc/Translate?' + options,
		method: 'GET',
		headers: {
			"Authorization": 'Bearer ' + token
		}
	},function(res){
		res.setEncoding('utf8');
		res.on('data',function(chunk){
			body += chunk;
		}).on('end',function(){
			eval(body);
		});
	}).on('error',function(err){
		// logger.fatal(err);
		throw err
	});

	req.end();

	function translated(text) {
		callback(text)
	}
}

/***
 *	getTranslateText
 *	Post Tweet
 *
 *	@params { string } post_text
 */
Utils.prototype.getTranslateText = function(japanese,fn){
	var self = this
	self._getMSTranslateAccessToken(function(token){
		self._translate(token,japanese,function(translated){
			fn(translated)
		})
	});
}

/***************
	Twitter API 	
***************/

/***
 *	getStreamingTweet
 *	get Stream
 *
 *	@return { object }
 */
Utils.prototype.getStreamingTweet = function(fn){
	var client = this._getTwitterToken()

	client.get("statuses/user_timeline",{ screen_name: "konojunya" },function(err,tweets,res){
		if(!err){
			var option = {follow: tweets[0].user.id_str};

			client.stream("statuses/filter",option,function(stream){
				stream.on("data",function(tweet){
					fn(tweet)
				})
				stream.on('error', function(error) {
					// logger.fatal(err);
					throw error
				});
			})
		}
	})

	// client.stream("user",function(strm_user){

	// 	var BOT_ID = "konojunya_EN"

	// 	strm_user.on("data",function(data){
	// 		var id = ('user' in data && 'screen_name' in data.user) ? data.user.screen_name : null;
	// 		var text = ('text' in data) ? data.text.replace(new RegExp('^@' + BOT_ID + ' '), '') : '';
	// 		var ifMention = ('in_reply_to_user_id' in data) ? (data.in_reply_to_user_id !== null) : false;

	// 		if (!ifMention || id == BOT_ID) return;
	// 		var msg = '@' + id + ' ' + text;
	// 		bot.updateStatus(msg , function (data) {
	// 			console.log(data.text);
	// 		});
	// 	})
	// 	strm_user.on('error', function(error) {
	// 	  throw error;
	// 	});
	// })
}


/***
 *	postTweet
 *	Post Tweet
 *
 *	@params { string } post_text
 */
Utils.prototype.postTweet = function(post_text){
	var T = this._getTwitterToken()
	var opt = {
		status: post_text
	}
	T.post("statuses/update",opt,function(err,data,res){
		// if(err) logger.fatal(err);
		throw err
		console.log(data.text)
	})
}

/***
 *	postTweet
 *	Post Tweet
 *
 *	@params { string } post_text
 */
Utils.prototype.postTweetWithMedia = function(post_text,media){
	var T = this._getTwitterToken()
	var opt = {
		status: post_text,
		media: media
	}
	T.post("statuses/update",opt,function(err,data,res){
		// if(err) logger.fatal(err);
		throw err
		console.log(data.text)
	})
}


module.exports = new Utils()