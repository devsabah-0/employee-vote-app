// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./participants.db'); // Persistent database file

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        designation TEXT NOT NULL,
        department TEXT NOT NULL,
        review TEXT NOT NULL,
        imagePath TEXT NOT NULL,
        votes INTEGER DEFAULT 0
    )`);
});

module.exports = db;
