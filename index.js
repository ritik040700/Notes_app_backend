const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  console.log({ content });
  
  // Correct query with `now()` for the `date` column
  db.query('INSERT INTO notes (content, date) VALUES (?, NOW())', [content], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, content });
  });
});


app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notes WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(204).end();
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
