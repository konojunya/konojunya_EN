package keys

import(
  "github.com/ChimeraCoder/anaconda"
  . "os"
)

func GetApiToken() *anaconda.TwitterApi {
  anaconda.SetConsumerKey(Getenv("EN_TWITTER_CONSUMER_KEY"))
  anaconda.SetConsumerSecret(Getenv("EN_TWITTER_CONSUMER_SECRET"))
  token := anaconda.NewTwitterApi(Getenv("EN_TWITTER_ACCESS_TOKEN"), Getenv("EN_TWITTER_ACCESS_TOKEN_SECRET"))
  return token
}

func GetApiaiToken() string {
	return Getenv("APIAI_BEARER_TOKEN_DEV")
}
