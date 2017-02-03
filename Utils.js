var
	apiai = require('apiai'),
	Twit = require('twit'),
	http = require('http'),
	https = require('https'),
	qs = require('querystring');


var Utils = function(){}

/********************
	Access Token Set.	
********************/
Utils.prototype._getTwitterAccessToken = function(){
	var T = new Twit({
		consumer_key: process.env.EN_TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.EN_TWITTER_CONSUMER_SECRET,
		access_token: process.env.EN_TWITTER_ACCESS_TOKEN,
		access_token_secret: process.env.EN_TWITTER_ACCESS_TOKEN_SECRET,
		timeout_ms: 60*1000
	})
	return T
}

Utils.prototype._getMSTranslateAccessToken = function(fn){
	let body = '';
  let data = {
      'client_id': process.env.MS_TRANSLATE_ID,
      'client_secret': process.env.MS_TRANSLATE_SECRET,
      'scope': 'http://api.microsofttranslator.com',
      'grant_type': 'client_credentials'
  };

  let req = https.request({
      host: 'datamarket.accesscontrol.windows.net',
      path: '/v2/OAuth2-13',
      method: 'POST'
  }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
          body += chunk;
      }).on('end', () => {
          let resData = JSON.parse(body);
          callback(resData.access_token);
      });
  }).on('error', (err) => {
      console.log(err);
  });
  req.write(qs.stringify(data));
  req.end();
}

Utils.prototype._getApiaiToken = function(){
	return apiai(process.env.APIAI_BEARER_TOKEN_DEV);
}

/*****************
	Translate API 		
*****************/

Utils.prototype._translate = function(token, text, callback){
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
		console.log(err);
	});

	req.end();

	function translated(text) {
		callback(text);
	}
}


Utils.prototype.getTranslateText = function(japanese){
	this._getMSTranslateAccessToken(function(token){
		this._translate(token,japanese,function(translated){
			console.log(translated)
		})
	})
}

/***************
	Twitter API 	
***************/

Utils.prototype.getStream = function(){
	return T.get("statuses/user_timeline",{ screen_name: "konojunya" },function(err,tweets,res){
		if(!err){

			var
				user_id = tweets[0].user.id_str,
				option = {follow: user_id};

			var stream = T.stream("statuses/filter",option);
			return stream;


		}else{ throw new Error(err) }
	})
}


module.exports = Utils