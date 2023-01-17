package tests

import (
	"log"
	utils "server/utils"
	"testing"
)

func TestCustomTimeDiff(t *testing.T) {
	log.Print(utils.CustomTimeDiff("1-16-2023 12:09 PM", "NmI", ""))

}
