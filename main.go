package main

import (
	"crypto/md5"
	"crypto/rand"
	"database/sql"
	_ "embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
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

type deckEntry struct {
	Glyph string
	Name  string
	IPA   string
}

var defaultDeck = []deckEntry{
	{Glyph: "𐑐", Name: "(P)eep", IPA: "/p/"},
	{Glyph: "𐑚", Name: "(B)ib", IPA: "/b/"},
	{Glyph: "𐑑", Name: "(T)ot", IPA: "/t/"},
	{Glyph: "𐑛", Name: "(D)ead", IPA: "/d/"},
	{Glyph: "𐑒", Name: "(K)ick", IPA: "/k/"},
	{Glyph: "𐑜", Name: "(G)ag", IPA: "/ɡ/"},
	{Glyph: "𐑓", Name: "(F)ee", IPA: "/f/"},
	{Glyph: "𐑝", Name: "(V)ow", IPA: "/v/"},
	{Glyph: "𐑔", Name: "(TH)igh", IPA: "/θ/"},
	{Glyph: "𐑞", Name: "(TH)ey", IPA: "/ð/"},
	{Glyph: "𐑕", Name: "(S)o", IPA: "/s/"},
	{Glyph: "𐑟", Name: "(Z)oo", IPA: "/z/"},
	{Glyph: "𐑖", Name: "(SH)ure", IPA: "/ʃ/"},
	{Glyph: "𐑠", Name: "mea(S)ure", IPA: "/ʒ/"},
	{Glyph: "𐑗", Name: "(CH)urch", IPA: "/t͡ʃ/"},
	{Glyph: "𐑡", Name: "(J)udge", IPA: "/d͡ʒ/"},
	{Glyph: "𐑘", Name: "(Y)ea", IPA: "/j/"},
	{Glyph: "𐑢", Name: "(W)oe", IPA: "/w/"},
	{Glyph: "𐑙", Name: "hu(NG)", IPA: "/ŋ/"},
	{Glyph: "𐑣", Name: "(H)aha", IPA: "/h/"},
	{Glyph: "𐑤", Name: "(L)oll", IPA: "/l/"},
	{Glyph: "𐑮", Name: "(R)oar", IPA: "/ɹ/"},
	{Glyph: "𐑥", Name: "(M)ime", IPA: "/m/"},
	{Glyph: "𐑯", Name: "(N)un", IPA: "/n/"},
	{Glyph: "𐑦", Name: "(I)f", IPA: "/ɪ/"},
	{Glyph: "𐑰", Name: "(E)at", IPA: "/iː/"},
	{Glyph: "𐑧", Name: "(E)gg", IPA: "/ɛ/"},
	{Glyph: "𐑱", Name: "(A)ge", IPA: "/eɪ/"},
	{Glyph: "𐑨", Name: "(A)sh", IPA: "/æ/"},
	{Glyph: "𐑲", Name: "(I)ce", IPA: "/aɪ/"},
	{Glyph: "𐑩", Name: "(A)do", IPA: "/ə/"},
	{Glyph: "𐑳", Name: "(U)p", IPA: "/ʌ/"},
	{Glyph: "𐑪", Name: "(O)n", IPA: "/ɒ~ɑ/"},
	{Glyph: "𐑴", Name: "(O)ak", IPA: "/oʊ/"},
	{Glyph: "𐑫", Name: "w(OO)l", IPA: "/ʊ/"},
	{Glyph: "𐑵", Name: "(OO)ze", IPA: "/uː/"},
	{Glyph: "𐑬", Name: "(OU)t", IPA: "/aʊ/"},
	{Glyph: "𐑶", Name: "Oil", IPA: "/ɔɪ/"},
	{Glyph: "𐑭", Name: "Ah", IPA: "/ɑː/"},
	{Glyph: "𐑷", Name: "Awe", IPA: "/ɔː/"},
	{Glyph: "𐑸", Name: "Are", IPA: "/ɑr/"},
	{Glyph: "𐑹", Name: "Or", IPA: "/ɔr/"},
	{Glyph: "𐑺", Name: "Air", IPA: "/ɛr/"},
	{Glyph: "𐑻", Name: "Err", IPA: "/ɜr/"},
	{Glyph: "𐑼", Name: "Array", IPA: "/ər/"},
	{Glyph: "𐑽", Name: "Ear", IPA: "/ɪr/"},
	{Glyph: "𐑾", Name: "Ian", IPA: "/aɪr/"},
	{Glyph: "𐑿", Name: "Yew", IPA: "/juː/"},
}

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
	if _, err := db.Exec("CREATE TABLE IF NOT EXISTS accounts (code TEXT PRIMARY KEY)"); err != nil {
		log.Fatal(err)
	}
	if _, err := db.Exec("CREATE TABLE IF NOT EXISTS account_stats (account_code TEXT PRIMARY KEY, stats TEXT, FOREIGN KEY(account_code) REFERENCES accounts(code))"); err != nil {
		log.Fatal(err)
	}
	if _, err := db.Exec("CREATE TABLE IF NOT EXISTS deck (id INTEGER PRIMARY KEY, glyph TEXT, name TEXT, ipa TEXT)"); err != nil {
		log.Fatal(err)
	}
	var count int
	if err := db.QueryRow("SELECT COUNT(*) FROM deck").Scan(&count); err != nil {
		log.Fatal(err)
	}
	if count == 0 {
		for i, d := range defaultDeck {
			if _, err := db.Exec("INSERT INTO deck(id, glyph, name, ipa) VALUES(?, ?, ?, ?)", i+1, d.Glyph, d.Name, d.IPA); err != nil {
				log.Fatal(err)
			}
		}
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
		if _, err := db.Exec("INSERT INTO accounts(code) VALUES(?)", code); err != nil {
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
		if _, err := db.Exec("INSERT INTO account_stats(account_code, stats) VALUES(?, ?) ON CONFLICT(account_code) DO UPDATE SET stats=excluded.stats", req.Code, string(req.Stats)); err != nil {
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
		var stats sql.NullString
		err := db.QueryRow("SELECT stats FROM account_stats WHERE account_code=?", req.Code).Scan(&stats)
		if err != nil && err != sql.ErrNoRows {
			http.Error(w, "db", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if stats.Valid {
			fmt.Fprintf(w, "{\"stats\":%s}", stats.String)
		} else {
			fmt.Fprint(w, "{\"stats\":null}")
		}
	})

	mux.HandleFunc("/api/deck", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, glyph, name, ipa FROM deck ORDER BY id")
		if err != nil {
			http.Error(w, "db", http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		type entry struct {
			ID    int    `json:"id"`
			Glyph string `json:"glyph"`
			Name  string `json:"name"`
			IPA   string `json:"ipa"`
		}
		var deck []entry
		for rows.Next() {
			var e entry
			if err := rows.Scan(&e.ID, &e.Glyph, &e.Name, &e.IPA); err != nil {
				http.Error(w, "db", http.StatusInternalServerError)
				return
			}
			deck = append(deck, e)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(deck)
	})

	addr := ":8080"
	log.Printf("Shavian flashcards server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
