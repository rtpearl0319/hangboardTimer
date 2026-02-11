package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

func main() {

	app := fiber.New()

	app.Get("/", func(c fiber.Ctx) {
		app.Get("/index", static.New("index.html"))
		app.Get("/styles.css", static.New("styles.css"))
	})

	log.Fatal(app.Listen(":80"))
}
