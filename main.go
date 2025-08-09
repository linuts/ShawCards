package main

import (
	_ "embed"
	"fmt"
	"log"
	"net/http"
)

//go:embed index.html
var indexHTML string

//go:embed app.js
var appJS string

//go:embed styles.css
var stylesCSS string

//go:embed stats.html
var statsHTML string

//go:embed stats.js
var statsJS string

func main() {
	mux := http.NewServeMux()

	// Serve index.html
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprint(w, indexHTML)
	})

	// Serve app.js
	mux.HandleFunc("/app.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		fmt.Fprint(w, appJS)
	})

	// Serve styles.css
	mux.HandleFunc("/styles.css", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/css; charset=utf-8")
		fmt.Fprint(w, stylesCSS)
	})

	// Serve stats.html
	mux.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprint(w, statsHTML)
	})

	// Serve stats.js
	mux.HandleFunc("/stats.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		fmt.Fprint(w, statsJS)
	})

	addr := ":8080"
	log.Printf("Shavian flashcards server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
