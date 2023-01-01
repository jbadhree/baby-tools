package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

// struct to decode request body
type requestBody struct {
	ActivityName string `json:"activityName"`
	ActivityTime string `json:"activityTime"`
}

// endpoint is /test now may need to change
func main() {
	http.HandleFunc("/test", HandleTest)
	http.ListenAndServe(":8080", nil) // may need to change port
}

func HandleTest(w http.ResponseWriter, r *http.Request) {
	// Initialize to empty string so that it can be used to send response
	var activity_name = ""
	var activity_time = ""
	// If its not a POST error out
	if r.Method == http.MethodPost {
		var body requestBody // 'body' is of type struct requestBody
		// r.Body gives body from request
		// use json.NewDecoder to structure if 'body'
		err := json.NewDecoder(r.Body).Decode(&body)
		if err != nil {
			log.Printf("Invalid Request Body!")
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		activity_name = body.ActivityName
		activity_time = body.ActivityTime
		// Connect DB based in values from Env Vars
		// Need to move it to sep function
		db, err := sql.Open("mysql", os.Getenv("DB_USER_NAME")+":"+os.Getenv("DB_USER_PASS")+"@tcp("+os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT")+")/"+os.Getenv("DB_NAME"))
		if err != nil {
			log.Printf("DB Connection Failed!")
			panic(err.Error())
		}
		defer db.Close()

		log.Printf("DB Connection Success!")

		// when user hits start we can insert the start_date_time in DB
		// When the use hits stop - find the latest entry where stop is null and enter it there
		// What if user hits stop first ?
		// What if the user forgot to press stop ?
		var q = "" // better variable names
		if body.ActivityName == "Start" {
			q = fmt.Sprintf("insert into timer_entries (entry_name,start_date_time) values ('%s','%s')", os.Getenv("ENTRY_NAME"), body.ActivityTime)
		} else {
			q = fmt.Sprintf("update timer_entries set end_date_time = '%s' where entry_id=(select * from (select entry_id from timer_entries where entry_name='%s' and end_date_time is null order by entry_id desc limit 1) ali);", body.ActivityTime, os.Getenv("ENTRY_NAME"))
		}

		insert, err := db.Query(q)
		if err != nil {
			if body.ActivityName == "Start" {
				log.Printf("Error with Start/Insert!")
			} else {
				log.Printf("Error with Stop/Update!")
			}
			panic(err.Error())
		}
		defer insert.Close()

		if body.ActivityName == "Start" {
			log.Printf("Yay, values added!")
		} else {
			log.Printf("Yay, values updated!")
		}

		log.Printf("Hello, %s!", body.ActivityName)
		log.Printf("Hello, %s!", body.ActivityTime)
	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
	// Need this header for CORS issue
	w.Header().Set("Access-Control-Allow-Origin", "*")

	log.Printf("inside HandleTest")
	// must send a better text
	// if start send last nap timing
	// if stop send duration of current/latest nap
	// we also need to send  last nap timing
	if activity_name == "Start" {
		fmt.Fprintf(w, "Nap Started at "+activity_time)
	} else {
		fmt.Fprintf(w, "Nap Ended at "+activity_time)
	}

}
