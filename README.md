# ShawCards

ShawCards is a small web application for practicing the Shavian alphabet with flashcards. The server is written in Go and serves a simple front end that lets you quiz yourself, view statistics, and reference a cheat sheet. Static HTML, CSS, and JavaScript assets live under the `static/` directory.

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
    GNU GENERAL PUBLIC LICENSE
    
    Copyright (C) 2025  Alexander B. Libby
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
