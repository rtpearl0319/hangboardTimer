package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

func main() {

	app := fiber.New()

	app.Get("/", static.New("index.html"))
	app.Get("/styles.css", static.New("styles.css"))
	app.Get("/main.js", static.New("main.js"))
	app.Get("/146963__zabuhailo__cathisses1.wav", static.New("146963__zabuhailo__cathisses1.wav"))
	app.Get("/813119__qubodup__cat-meow.wav", static.New("813119__qubodup__cat-meow.wav"))

	log.Fatal(app.Listen("localhost:3000"))
}
