# ShawCards

ShawCards is a small web application for practicing the Shavian alphabet with flashcards. The server is written in Go and serves a simple front end that lets you quiz yourself, view statistics, and reference a cheat sheet. Static HTML, CSS, and JavaScript assets live under the `static/` directory.

### Flashcards
<img width="1918" height="853" alt="image" src="https://github.com/user-attachments/assets/b9154e4c-d932-4c3a-9c00-c8b73c7aa28e" />

### Stas
<img width="1918" height="853" alt="image" src="https://github.com/user-attachments/assets/3cd7e08f-3432-49f6-b62e-80e9df0b9602" />

### Cheat Sheet
<img width="1918" height="853" alt="image" src="https://github.com/user-attachments/assets/62335168-454a-4d6d-9d56-167f2c35b930" />

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
