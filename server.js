// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();
app.use(express.static('public'));

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

// GET route to retrieve all participants
app.get('/participants', (req, res) => {
    db.all('SELECT * FROM participants', [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// POST route to add a new participant with image upload
app.post('/participants', upload.single('image'), (req, res) => {
    const { name, designation, department, review } = req.body;
    const imagePath = req.file ? `/assets/images/${req.file.filename}` : '/assets/images/placeholder.svg';
    db.run(`INSERT INTO participants (name, designation, department, review, imagePath) VALUES (?, ?, ?, ?, ?)`,
        [name, designation, department, review, imagePath], function(err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).send(err.message);
            }
            res.status(201).json({ id: this.lastID });
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
