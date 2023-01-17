package utils

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

// This is a custom time difference that can be used to return the difference ..
// .. based on the provided @diffType and returned difference can be in a provided ...
// .. @outputFormat for a provided @inputTime
// The @inputTime will be a string with format - M-D-YYYY H:M A -- Eg: 1-4-2023 9:03 PM
// @diffType parameter is to tell if the diff must be Now - inputTime or inputTime - Now
// Values can be "NmI" for Now - inputTime or "ImN" for inputTime - Now
// @outputFormat is to specify If the output must be in Minutes or Hour Minutes
// Values can be "M" or "MH"
func CustomTimeDiff(inputTime string, diffType string, outputFormat string) string {
	if inputTime == "None" || len(diffType) == 0 {
		panic("Input Not Right to CustomTimeDiff")
	}
	var returnDiff = ""
	// First we need to convert the string to actual date/time type
	// This logic starts here ..... and...
	var splitDateTime = strings.Split(inputTime, " ")
	var splitDate = strings.Split(splitDateTime[0], "-")
	endDateTimeYear, err := strconv.Atoi(splitDate[2])
	if err != nil {
		log.Print("Error in Time Conversion")
		log.Print(err)
	}
	endDateTimeMonth, err := strconv.Atoi(splitDate[0])
	if err != nil {
		log.Print("Error in Time Conversion")
		log.Print(err)
	}
	endDateTimeDate, err := strconv.Atoi(splitDate[1])
	if err != nil {
		log.Print("Error in Time Conversion")
		log.Print(err)
	}
	var splitTime = strings.Split(splitDateTime[1], ":")
	if err != nil {
		log.Print("Error in Time Conversion")
		log.Print(err)
	}
	endDateTimeHour, err := strconv.Atoi(splitTime[0])
	if err != nil {
		log.Print("Error in Time Conversion")
		log.Print(err)
	}
	endDateTimeMinute, err := strconv.Atoi(splitTime[1])
	if err != nil {
		log.Print("Error in Time Conversion")
		log.Print(err)
	}

	// If the time is PM need to add 12 to convert to 24 hour format
	// but if hour is 12 then no need to add
	if splitDateTime[2] == "PM" && endDateTimeHour != 12 {
		endDateTimeHour = endDateTimeHour + 12
	}
	// If its AM and hour is 12 then it must be 00 to covert to 24 hour format
	if splitDateTime[2] == "AM" && endDateTimeHour == 12 {
		endDateTimeHour = 00
	}

	convertedInputTime := time.Date(endDateTimeYear, time.Month(endDateTimeMonth), endDateTimeDate, endDateTimeHour, endDateTimeMinute, 0, 0, time.Now().Local().Location())
	// .... Ends here

	log.Print(convertedInputTime)

	// Current time - Hopefully in same timezone as input time
	currentTime := time.Now()
	log.Print(currentTime)

	if diffType == "NmI" {
		// Return in String
		returnDiff = fmt.Sprintf("%f", currentTime.Sub(convertedInputTime).Minutes())
	} else if diffType == "ImN" {
		returnDiff = fmt.Sprintf("%f", convertedInputTime.Sub(currentTime).Minutes())
	} else {
		returnDiff = "Error"
		log.Print("Invalid Input for diffType")
		panic("Invalid Input for diffType")
	}

	return returnDiff

}
