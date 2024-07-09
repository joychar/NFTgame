const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const uploadDir = path.join(__dirname, 'image1');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/image1', express.static(path.join(__dirname, 'image1')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image1/');
  },
  filename: function (req, file, cb) {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return cb(err);
      }
      const imageCount = files.length;
      cb(null, `${imageCount}.png`);
    });
  }
});

const upload = multer({ storage: storage });

app.post('/api/image1', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file selected' });
    }
    res.status(200).json({ success: true, filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.get('/api/image1', (req, res) => {
  const imageDir = path.join(__dirname, 'image1');
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read image directory' });
    }
    res.json({ count: files.length });
  });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});