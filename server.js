// server.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const notesFilePath = path.join(__dirname, 'notes.json');

app.post('/api/notes', async (req, res) => {
  try {
    const { title, text } = req.body;
    const notes = await loadNotes();
    notes.push({ title, text, createdAt: new Date() });
    await saveNotes(notes);
    res.status(201).json({ message: 'Note saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
  // GET endpoint (get all notes)
  app.get('/api/notes', async (req, res) => {
    try {
      const notes = await loadNotes();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // GET endpoint (get a single note by ID)
  app.get('/api/notes/:id', async (req, res) => {
    try {
      const notes = await loadNotes();
      const note = notes.find(note => note.id === req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // PUT endpoint (update a note by ID)
  app.put('/api/notes/:id', async (req, res) => {
    try {
      const notes = await loadNotes();
      const index = notes.findIndex(note => note.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }
      const updatedNote = { ...notes[index], ...req.body };
      notes[index] = updatedNote;
      await saveNotes(notes);
      res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // DELETE endpoint (delete a note by ID)
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const notes = await loadNotes();
      const filteredNotes = notes.filter(note => note.id !== req.params.id);
      if (filteredNotes.length === notes.length) {
        return res.status(404).json({ message: 'Note not found' });
      }
      await saveNotes(filteredNotes);
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

async function loadNotes() {
  try {
    const data = await fs.readFile(notesFilePath);
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return [];
    }
    throw error;
  }
}

async function saveNotes(notes) {
  await fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2));
}

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
