const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to shared folder (network drive)
const SCANNED_DOCS_PATH = "\\\\192.168.10.26\\it_files\\SCANNED DOCS\\PR Scanned List";

// Allow cross-origin requests
app.use(cors());

// Serve static files (CSS, JS, assets) from same folder
app.use(express.static(__dirname));

// Serve the HTML file on "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Multer setup to save uploads to network folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, SCANNED_DOCS_PATH),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// API: Get list of PDFs
app.get('/api/pr-scanned-list', (req, res) => {
  fs.readdir(SCANNED_DOCS_PATH, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read directory' });
    const pdfFiles = files
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(name => ({ name }));
    res.json(pdfFiles);
  });
});

// API: View a specific PDF
app.get('/api/pr-scanned-list/view/:filename', (req, res) => {
  const filePath = path.join(SCANNED_DOCS_PATH, req.params.filename);
  res.sendFile(filePath);
});

// API: Upload a new PDF
app.post('/api/pr-scanned-list/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'Uploaded' });
});

// API: Delete a PDF
app.delete('/api/pr-scanned-list/delete/:filename', (req, res) => {
  const filePath = path.join(SCANNED_DOCS_PATH, req.params.filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.status(200).json({ message: 'Deleted' });
  });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
