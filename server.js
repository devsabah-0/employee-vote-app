// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./participants.db'); // Persistent database file

const app = express();
app.use(express.static('public')); // Serve static files from the 'public' directory

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only SVG files are allowed!'));
    }
});

// Initialize the database and create the table if it doesn't exist
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

    // Create a table to store application settings
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`);

    // Initialize voting status if not set
    db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('votingOpen', 'false')`);
});

// GET route to retrieve all participants
app.get('/participants', (req, res) => {
    db.all('SELECT * FROM participants', [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// GET route to check voting status
app.get('/voting-status', (req, res) => {
    db.get(`SELECT value FROM settings WHERE key = 'votingOpen'`, (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json({ votingOpen: row.value === 'true' });
    });
});

// POST route to toggle voting status
app.post('/toggle-voting', (req, res) => {
    db.get(`SELECT value FROM settings WHERE key = 'votingOpen'`, (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        const newStatus = row.value === 'true' ? 'false' : 'true';
        db.run(`UPDATE settings SET value = ? WHERE key = 'votingOpen'`, newStatus, (err) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json({ votingOpen: newStatus === 'true' });
        });
    });
});

// POST route to add a new participant with image upload
app.post('/participants', upload.single('image'), (req, res) => {
    const { name, designation, department, review } = req.body;
    const imagePath = req.file ? `/assets/images/${req.file.filename}` : '/assets/images/placeholder.svg';
    db.run(`INSERT INTO participants (name, designation, department, review, imagePath, votes) VALUES (?, ?, ?, ?, ?, 0)`,
        [name, designation, department, review, imagePath], function(err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).send(err.message);
            }
            res.status(201).json({ id: this.lastID });
        });
});

// PUT route to increment votes for a participant
app.put('/participants/:id/vote', (req, res) => {
    db.get(`SELECT value FROM settings WHERE key = 'votingOpen'`, (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (row.value !== 'true') {
            return res.status(403).send('Voting is currently closed.');
        }
        const { id } = req.params;
        console.log(`Incrementing vote for participant ID: ${id}`);
        db.run(`UPDATE participants SET votes = votes + 1 WHERE id = ?`, id, function(err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).send(err.message);
            }
            console.log(`Vote successfully incremented for participant ID: ${id}`);
            res.status(204).send();
        });
    });
});

// DELETE route to remove a participant
app.delete('/participants/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM participants WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(204).send();
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
