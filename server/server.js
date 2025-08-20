/*-- Created By: Aron Kyle D. Suarnaba - System Analyst Programmer Trainee
//Date: August 2025 
Site: Printwell, Inc.
*/

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to shared folder (network drive)
const SCANNED_DOCS_PATH = "\\\\192.168.10.26\\it_files\\SCANNED DOCS\\PR Scanned List";

// Middleware
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json()); // Needed for PUT body

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Multer setup for upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, SCANNED_DOCS_PATH),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Get list of PDFs
app.get('/api/pr-scanned-list', (req, res) => {
  fs.readdir(SCANNED_DOCS_PATH, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read directory' });

    const pdfFiles = files
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(name => {
        const fullPath = path.join(SCANNED_DOCS_PATH, name);
        const stats = fs.statSync(fullPath);
        return { name, mtime: stats.mtime };
      })
      .sort((a, b) => b.mtime - a.mtime) // Sort descending (latest first)
      .map(({ name }) => ({ name })); // Remove mtime from final response

    res.json(pdfFiles);
  });
});


// View a specific PDF
app.get('/api/pr-scanned-list/view/:filename', (req, res) => {
  const filePath = path.join(SCANNED_DOCS_PATH, req.params.filename);
  res.sendFile(filePath);
});

// Upload PDF
app.post('/api/pr-scanned-list/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'Uploaded' });
});

// Delete PDF
app.delete('/api/pr-scanned-list/delete/:filename', (req, res) => {
  const filePath = path.join(SCANNED_DOCS_PATH, req.params.filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ message: 'Deleted' });
  });
});

// Rename PDF
app.put('/api/pr-scanned-list/rename', (req, res) => {
  const { oldName, newName } = req.body;

  if (!oldName || !newName || !newName.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ error: 'Invalid file names' });
  }

  const oldPath = path.join(SCANNED_DOCS_PATH, oldName);
  const newPath = path.join(SCANNED_DOCS_PATH, newName);

  if (fs.existsSync(newPath)) {
    return res.status(409).json({ error: 'File with new name already exists' });
  }

  fs.rename(oldPath, newPath, (err) => {
    if (err) return res.status(500).json({ error: 'Rename failed' });
    res.status(200).json({ message: 'Renamed successfully' });
  });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
