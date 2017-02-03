package main

import (
	. "./keys"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type QResponse struct {
	ID        string    `json:"id"`
	Timestamp time.Time `json:"timestamp"`
	Result    struct {
		Source           string `json:"source"`
		ResolvedQuery    string `json:"resolvedQuery"`
		Action           string `json:"action"`
		ActionIncomplete bool   `json:"actionIncomplete"`
		Parameters       struct {
			Name string `json:"name"`
		} `json:"parameters"`
		Contexts []struct {
			Name       string `json:"name"`
			Parameters struct {
				Name string `json:"name"`
			} `json:"parameters"`
			Lifespan int `json:"lifespan"`
		} `json:"contexts"`
		Metadata struct {
			IntentID   string `json:"intentId"`
			IntentName string `json:"intentName"`
		} `json:"metadata"`
		Fulfillment struct {
			Speech string `json:"speech"`
		} `json:"fulfillment"`
	} `json:"result"`
	Status struct {
		Code      int    `json:"code"`
		ErrorType string `json:"errorType"`
	} `json:"status"`
}

func main() {
	url := fmt.Sprintf("https://api.api.ai/v1/query?v=20150910&query=fox%20says&lang=en&latitude=35.925&longitude=-86.8688889&sessionId=1234567890")

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal("NewRequest: ", err)
		return
	}

	req.Header.Add("Authorization", "Bearer "+GetApiaiToken())
	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Do: ", err)
		return
	}

	defer resp.Body.Close()

	var record QResponse
	if err := json.NewDecoder(resp.Body).Decode(&record); err != nil {
		log.Println(err)
	}

	fmt.Println("Status = ", record.Status.Code)
	fmt.Println("Response = ", record.Result.Fulfillment.Speech)
}
