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
	Message      string `json:"message"`
}

// format of the latest start and end time records from DB
type TimeFromDB struct {
	StartDateTime string `json:"start_date_time"`
	EndDateTime   string `json:"end_date_time"`
}

// type to parse latest entries from db

type LatestEntries struct {
	Key           string `json:"key"`
	Duration      string `json:"duration"`
	StartDateTime string `json:"startTime"`
	EndDateTime   string `json:"endTime"`
	Description   string `json:"description"`
}

// endpoint is /test now may need to change
func main() {
	http.HandleFunc("/insert", HandleInsert)
	http.HandleFunc("/current", HandleCurrentStatus)
	http.HandleFunc("/latestentries", HandleLatestEntries)
	//http.ListenAndServe(":8080", nil) // may need to change port
	http.ListenAndServeTLS(":8080", "subh.babus.net.crt", "subh.babus.net.key", nil) // may need to change port
}

func HandleInsert(w http.ResponseWriter, r *http.Request) {
	// Initialize to empty string so that it can be used to send response
	var activity_name = ""
	var activity_time = ""
	var message = ""
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

		if len(body.Message) > 0 {
			message = body.Message
		} else {
			message = "None"
		}

		// Connect DB based in values from Env Vars
		// Need to move it to sep function
		db, err := sql.Open("mysql", os.Getenv("DB_USER_NAME")+":"+os.Getenv("DB_USER_PASS")+"@tcp("+os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT")+")/"+os.Getenv("DB_NAME"))
		if err != nil {
			log.Printf("DB Connection Failed!")
			panic(err.Error())
		}
		defer db.Close()

		// when user hits start we can insert the start_date_time in DB
		// When the use hits stop - find the latest entry where stop is null and enter it there
		// What if user hits stop first ?
		// What if the user forgot to press stop ?
		var q = "" // better variable names
		if body.ActivityName == "Start" {
			q = fmt.Sprintf("insert into timer_entries (entry_name,start_date_time, start_message) values ('%s','%s', '%s')", os.Getenv("ENTRY_NAME"), body.ActivityTime, message)
		} else {
			q = fmt.Sprintf("update timer_entries set end_date_time = '%s', stop_message = '%s' where entry_id=(select * from (select entry_id from timer_entries where entry_name='%s' and end_date_time is null order by entry_id desc limit 1) ali)", body.ActivityTime, message, os.Getenv("ENTRY_NAME"))
		}

		insertOrUpdate, err := db.Query(q)
		if err != nil {
			if body.ActivityName == "Start" {
				log.Printf("Error with Start/Insert!")
			} else {
				log.Printf("Error with Stop/Update!")
			}
			panic(err.Error())
		}
		defer insertOrUpdate.Close()

		if body.ActivityName == "Start" {
			log.Printf("Yay, values added!")
		} else {
			log.Printf("Yay, values updated!")
		}

		// log.Printf("Hello, %s!", body.ActivityName)
		// log.Printf("Hello, %s!", body.ActivityTime)
	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
	// Need this header for CORS issue
	w.Header().Set("Access-Control-Allow-Origin", "*")

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

// function to get current status from db
func HandleCurrentStatus(w http.ResponseWriter, r *http.Request) {
	log.Printf("Inside Current Status")

	var currentStatusText = ""
	if r.Method == http.MethodGet {

		// May need to move to different function
		db, err := sql.Open("mysql", os.Getenv("DB_USER_NAME")+":"+os.Getenv("DB_USER_PASS")+"@tcp("+os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT")+")/"+os.Getenv("DB_NAME"))
		if err != nil {
			log.Printf("DB Connection Failed!")
			panic(err.Error())
		}

		defer db.Close()

		// Get the Max Row in the DB for given entry name
		// Select start date time and end date time
		var currentStatusQuery = fmt.Sprintf("select start_date_time,IFNULL(end_date_time,'None') from timer_entries where entry_name='%s' and entry_id = (select * from (select entry_id from timer_entries where entry_name='%s' order by entry_id desc limit 1) ali)", os.Getenv("ENTRY_NAME"), os.Getenv("ENTRY_NAME"))

		results, err := db.Query(currentStatusQuery)
		if err != nil {
			panic(err.Error())
		}

		for results.Next() {

			var timeFromDB TimeFromDB
			err = results.Scan(&timeFromDB.StartDateTime, &timeFromDB.EndDateTime)
			if err != nil {
				log.Printf("No Rows Found for current date time query!")
				panic(err.Error())
			}

			// If end date time is null then status should be set as "Nap Started at - start_date_time"
			// Else status should be set as "Last Nap was at - end_date_time"
			if timeFromDB.EndDateTime == "None" {
				currentStatusText = fmt.Sprintf("Nap Started at - %s", timeFromDB.StartDateTime)
			} else {
				currentStatusText = fmt.Sprintf("Last Nap Ended at - %s", timeFromDB.EndDateTime)
			}

		}

	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	log.Print(currentStatusText)

	w.Header().Set("Access-Control-Allow-Origin", "*")

	fmt.Fprintf(w, currentStatusText+"!")

}

// Get the last 24 hours data and return in a format that react can understand better
func HandleLatestEntries(w http.ResponseWriter, r *http.Request) {
	log.Print("Inside Latest Entries")
	var latestEntriesOutput []LatestEntries
	if r.Method == http.MethodGet {

		// May need to move to different function
		db, err := sql.Open("mysql", os.Getenv("DB_USER_NAME")+":"+os.Getenv("DB_USER_PASS")+"@tcp("+os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT")+")/"+os.Getenv("DB_NAME"))
		if err != nil {
			log.Printf("DB Connection Failed!")
			panic(err.Error())
		}

		defer db.Close()

		// Get the Max Row in the DB for given entry name
		// Select start date time and end date time
		// Escaping % using Hex code for % (25)
		var latestEntriesQuery = fmt.Sprintf("select entry_id as 'key', IFNULL(CAST(TIMEDIFF(STR_TO_DATE(end_date_time,'\x25%m-\x25%d-\x25%Y \x25%h:\x25%i:\x25%s \x25%p'),STR_TO_DATE(start_date_time,'\x25%m-\x25%d-\x25%Y \x25%h:\x25%i:\x25%s \x25%p')) As CHAR),'None') duration, start_date_time as startTime, IFNULL(end_date_time, 'None') as endTime,  CONCAT('Start Message: ', IFNULL(start_message,'None'), '  |  ','Stop Message: ' , IFNULL(stop_message,'None')) as description from timer_entries where STR_TO_DATE(start_date_time,'\x25%m-\x25%d-\x25%Y \x25%h:\x25%i:\x25%s \x25%p') >= DATE_ADD(convert_tz(now(),'+00:00','-05:00'), INTERVAL -48 HOUR) and entry_name='%s' order by entry_id desc;", os.Getenv("ENTRY_NAME"))
		// log.Print(latestEntriesQuery)
		results, err := db.Query(latestEntriesQuery)
		if err != nil {
			panic(err.Error())
		}

		for results.Next() {

			var latestEntries LatestEntries
			err = results.Scan(&latestEntries.Key, &latestEntries.Duration, &latestEntries.StartDateTime, &latestEntries.EndDateTime, &latestEntries.Description)
			if err != nil {
				log.Printf("No Rows Found for current date time query!")
				panic(err.Error())
			}
			latestEntriesOutput = append(latestEntriesOutput, latestEntries)

		}

	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	// log.Print(latestEntriesOutput)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(latestEntriesOutput)

}
