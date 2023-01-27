package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	event "server/event"
	nap "server/nap"
)

// endpoint is /test now may need to change
func main() {
	http.HandleFunc("/insert", nap.HandleInsert)
	http.HandleFunc("/current", nap.HandleCurrentStatus)
	http.HandleFunc("/latestentries", nap.HandleLatestEntries)
	http.HandleFunc("/insertevent", event.HandleFeedEntry)
	http.HandleFunc("/currentevent", event.HandleCurrentStatus)

	// Get hostname and see if it has 123456
	// If it does serve https else serve http
	// This is under assumption prod hosts will have 123456 in their names
	hostname, err := os.Hostname()
	if err != nil {
		log.Print("Unable to find hostname so exiting! ")
		panic(err)
	} else {
		if strings.Contains(hostname, "123456") {
			http.ListenAndServeTLS(":8080", "subh.babus.net.crt", "subh.babus.net.key", nil) // may need to change port
		} else {
			http.ListenAndServe(":8080", nil)
		}
	}

}
