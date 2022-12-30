package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/test", HandleTest)
	http.ListenAndServe(":8080", nil)
}

func HandleTest(w http.ResponseWriter, r *http.Request) {
	log.Printf("inside HandleTest")
	fmt.Fprintf(w, "HW")

}
