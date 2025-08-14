# ShawCards

ShawCards is a small web application for practicing the Shavian alphabet with flashcards. The server is written in Go and serves a simple front end that lets you quiz yourself, view statistics, and reference a cheat sheet.

## Getting Started

1. **Install Go** (version 1.20 or later recommended).
2. **Run the server**:
   ```bash
   go run main.go
   ```
   The application listens on [http://localhost:8080](http://localhost:8080).
3. The first run creates a `data.db` SQLite database in the project directory to store progress.

## Building

Use the provided script to build binaries for Linux, macOS, and Windows on both `amd64` and `arm64` architectures:

```bash
./build.sh
```

The compiled binaries are written to the `build` directory as `shawcards_<os>_<arch>`.

## Available Pages

- `/` – Flashcard practice interface
- `/stats` – Progress statistics
- `/cheatsheet` – Full glyph cheat sheet

## Testing

Before committing changes, run the Go tests to ensure the project builds:

```bash
go test ./...
```

(There are currently no tests, so this command simply confirms the code compiles.)

## License

This project does not yet specify a license.
