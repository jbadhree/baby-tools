package event

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type feedEntry struct {
	FeedTime     string `json:"feedTime"`
	FeedQuantity string `json:"feedQuantity"`
	FeedMessage  string `json:"feedMessage"`
}

func HandleFeedEntry(w http.ResponseWriter, r *http.Request) {
	log.Print("Inside HandleFeedEntry")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == http.MethodPost {

		// declare a variable to parse and store request body
		var body feedEntry

		// Decode and store in variable body
		err := json.NewDecoder(r.Body).Decode(&body)
		if err != nil {
			log.Print("HandleFeedEntry Request Body Invalid")
			http.Error(w, "bad request", http.StatusBadRequest)
			return

		}

		var feed_time = body.FeedTime
		var feed_quantity = body.FeedQuantity
		var feed_message = body.FeedMessage

		// If no error proceed with DB connection and then insert

		db, err := sql.Open("mysql", os.Getenv("DB_USER_NAME")+":"+os.Getenv("DB_USER_PASS")+"@tcp("+os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT")+")/"+os.Getenv("DB_NAME"))
		if err != nil {
			log.Print("DB Connection Failed!")
			panic(err.Error())
		}

		defer db.Close()
		var insert_query = fmt.Sprintf("insert into event_entries (entry_type, event_date_time, event_property_1, message) values ( '%s', '%s', '%s', '%s')", os.Getenv("ENTRY_NAME"), feed_time, feed_quantity, feed_message)

		insert, err := db.Query(insert_query)
		if err != nil {
			log.Print("Error inserting values in event_entries table!")
			http.Error(w, "Error inserting values in db", http.StatusInternalServerError)

		}

		defer insert.Close()

	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}

	fmt.Fprintf(w, "Entry Inserted!")
}
