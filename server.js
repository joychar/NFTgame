const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5500;

const uploadDir = path.join(__dirname, 'image1');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

let uris = [];

app.get('/uris', (req, res) => {
  res.json(uris);
})

app.get('/uris/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const uri = uris.find(uri => uri.id === id); 

  if (uri) {
    res.json(uri);
  } else {
    res.status(404).json({ message: '未找到' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));  
});

app.get('/my', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/my.html'));  
});

app.get('/mint', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/mint.html'));  
});

app.use('/image1', express.static(path.join(__dirname, 'image1')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/tokenURI',express.static(path.join(__dirname, 'tokenURI')));

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

async function getImageCount() {
  const files = await fs.promises.readdir(uploadDir);
  return files.length;
}

app.post('/api/image1', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file selected' });
    }
    const tokenId = await getImageCount() - 1; // 获取图像数量或者其他标识
    console.log(`Uploaded image ${tokenId}`);
    // 构造 NFT 数据
    const nftData = {
      id: tokenId,
      name: `NFT #${tokenId}`,
      description: `这是NFT #${tokenId}`,
      image: `/image1/${tokenId}.png`,
      attributes: [
        { }
      ]
    };

    uris.push(nftData);

    // 将 NFT 数据写入 JSON 文件
    const jsonData = JSON.stringify(nftData, null, 2);
    const jsonFilePath = path.join(__dirname, 'tokenURI', `${tokenId}.json`);
    fs.writeFileSync(jsonFilePath, jsonData);

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

app.get('/api/tokenURI/:tokenId', (req, res) => {
  const tokenId = req.params.tokenId;
  const jsonFilePath = path.join(__dirname, 'tokenURI', `${tokenId}.json`);

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

async function getImageCount() {
  const uploadDir = path.join(__dirname, 'image1');
  return new Promise((resolve, reject) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return reject(err);
      }
      const imageCount = files.length;
      resolve(imageCount);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});