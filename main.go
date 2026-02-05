package main

import (
	"fmt"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

func main() {

	app := fiber.New()

	app.Get("/", func(c fiber.Ctx) error {
		userName := c.Req().Query("userName")
		userAge := c.Req().Query("userAge")

		return c.SendString("Hello World!" + " " + userName + " " + userAge)
	})

	// 1) [x] Create route path called invokeCallback, Post
	// 2) [x] Move invokeCallbackFunction to GO
	// 3) [x] Call invokeCallbackFunction when path is used, be sure to utilize the 3 different ways for the params

	app.Post("/invokeCallback", func(c fiber.Ctx) error {
		// TODO: Call invokeCallbackFunction

		start := func() string {
			return "I DON'T KNOW MAN"
		}

		invokeCallBackFunction(start, iHateThis, func(index int) string {
			fmt.Println("Camden Made Me Do This")
			return "Completed" + strconv.Itoa(index) + " many times"
		}, 4)

		return c.SendString("Hello World! We created invokeCallbackFunction")

	})

	app.Get("/index", static.New("index.html"))
	app.Get("/styles.css", static.New("styles.css"))

	log.Fatal(app.Listen(":3000"))
}

/*func exampleCallback(onStart func()) {
	onStart()
}*/

func iHateThis(index int) {
	fmt.Println(strconv.Itoa(index) + " Internal Screaming")
}

func invokeCallBackFunction(start func() string, iHateThis func(int), onComplete func(int) string, indexCounter int) {

	fmt.Println(start())

	for i := 0; i < indexCounter; i++ {
		iHateThis(i)
	}
	onComplete(indexCounter)
}

/*

function iHateThis(index){
        console.log(index + "INTERNAL SCREAMING")
    }

let start = () => {
                return "I DON'T KNOW MAN";
            }

invokeCallBackFunction(start, iHateThis, (index) => {
                console.log("Camden Made Me Do This");
                return "Completed " + index + " many times"},
            4)

function invokeCallBackFunction(onStart, onLoop, onComplete, iterationCounter){
        console.log(onStart());
        for (let i = 0; i < iterationCounter; i++) {
            onLoop(i);
        }
        onComplete(iterationCounter);
    }

*/
