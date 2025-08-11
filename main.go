package main

import (
	"crypto/md5"
	"crypto/rand"
	"database/sql"
	_ "embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	_ "modernc.org/sqlite"
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

//go:embed cheatsheet.html
var cheatHTML string

//go:embed cheatsheet.js
var cheatJS string
var db *sql.DB

func generateCode() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	h := md5.Sum(b)
	return hex.EncodeToString(h[:]), nil
}

func main() {
	var err error
	db, err = sql.Open("sqlite", "data.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	if _, err := db.Exec("CREATE TABLE IF NOT EXISTS accounts (code TEXT PRIMARY KEY, data TEXT)"); err != nil {
		log.Fatal(err)
	}

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

	// Serve cheatsheet.html
	mux.HandleFunc("/cheatsheet", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprint(w, cheatHTML)
	})

	// Serve cheatsheet.js
	mux.HandleFunc("/cheatsheet.js", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		fmt.Fprint(w, cheatJS)
	})

	mux.HandleFunc("/api/new-account", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		code, err := generateCode()
		if err != nil {
			http.Error(w, "code gen", http.StatusInternalServerError)
			return
		}
		if _, err := db.Exec("INSERT INTO accounts(code, data) VALUES(?, '{}')", code); err != nil {
			http.Error(w, "db", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"code": code})
	})

	mux.HandleFunc("/api/save", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Code  string          `json:"code"`
			Deck  json.RawMessage `json:"deck"`
			Stats json.RawMessage `json:"stats"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad json", http.StatusBadRequest)
			return
		}
		if req.Code == "" {
			http.Error(w, "missing code", http.StatusBadRequest)
			return
		}
		data, err := json.Marshal(map[string]json.RawMessage{"deck": req.Deck, "stats": req.Stats})
		if err != nil {
			http.Error(w, "encode", http.StatusInternalServerError)
			return
		}
		if _, err := db.Exec("INSERT INTO accounts(code, data) VALUES(?, ?) ON CONFLICT(code) DO UPDATE SET data=excluded.data", req.Code, string(data)); err != nil {
			http.Error(w, "db", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	mux.HandleFunc("/api/load", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		var req struct {
			Code string `json:"code"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad json", http.StatusBadRequest)
			return
		}
		if req.Code == "" {
			http.Error(w, "missing code", http.StatusBadRequest)
			return
		}
		var data string
		err := db.QueryRow("SELECT data FROM accounts WHERE code=?", req.Code).Scan(&data)
		if err == sql.ErrNoRows {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		if err != nil {
			http.Error(w, "db", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, data)
	})

	addr := ":8080"
	log.Printf("Shavian flashcards server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
