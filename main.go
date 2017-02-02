package main

import(
  . "./keys"
  . "fmt"
)

func main(){
  api := GetApiToken()

  text := "Let's write it with Golang."
  tweet, err := api.PostTweet(text,nil)
  if err != nil {
    panic(err)
  }

  Print(tweet.Text)
}
