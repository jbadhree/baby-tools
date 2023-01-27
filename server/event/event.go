package event

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"server/utils"

	_ "github.com/go-sql-driver/mysql"
)

type feedEntry struct {
	FeedTime     string `json:"feedTime"`
	FeedQuantity string `json:"feedQuantity"`
	FeedMessage  string `json:"feedMessage"`
}

type LatestData struct {
	NoOfFeeds           string `json:"no_of_feeds"`
	TotalQuantity       string `json:"total_quantity"`
	LatestEventDateTime string `json:"latest_event_date_time"`
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

func HandleCurrentStatus(w http.ResponseWriter, r *http.Request) {
	log.Print("inside CUrrent Status")
	w.Header().Set("Access-Control-Allow-Origin", "*")
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
		var currentStatusQuery = fmt.Sprintf("select CAST(subb.no_of_feeds as char) no_of_feeds, CAST(subb.total_quantity as char) total_quantity, (select event_date_time from event_entries where entry_id=subb.entry_id) latest_event_date_time from ( "+
			"select DATE_FORMAT(date, '\x25%m-\x25%d-\x25%Y') date, count(1) no_of_feeds, sum(quantity) total_quantity, max(entry_id) entry_id "+
			"from (select str_to_date(substring_index(event_date_time,' ', 1) , '\x25%m-\x25%d-\x25%Y') as date, cast(substring_index(event_property_1,' ', 1) as unsigned) as quantity , entry_id from event_entries where entry_type='%s') sub "+
			"group by date order by date desc limit 1) subb", os.Getenv("ENTRY_NAME"))

		results, err := db.Query(currentStatusQuery)
		if err != nil {
			panic(err.Error())
		}

		defer results.Close()

		for results.Next() {

			var latestData LatestData
			err = results.Scan(&latestData.NoOfFeeds, &latestData.TotalQuantity, &latestData.LatestEventDateTime)
			if err != nil {
				log.Printf("No Rows Found for current date time query!")
				panic(err.Error())
			}

			currentStatusText = fmt.Sprintf("%s Feeds, Total %s Oz. %s Minutes Past", latestData.NoOfFeeds, latestData.TotalQuantity, utils.CustomTimeDiff(latestData.LatestEventDateTime, "NmI", ""))

		}

	} else {
		http.Error(w, "Method Not allowed", http.StatusMethodNotAllowed)
	}

	log.Print(currentStatusText)
	fmt.Fprintf(w, currentStatusText+"!")

}
