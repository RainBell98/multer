const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 8000;

//view engine 설정
app.set('view engine', 'ejs');
//정적파일세팅
app.use('/uploads', express.static(__dirname + '/uploads'));
//multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        //확장자 분리
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
});
const upload = multer({ storage });

//router
app.get('/', (req, res) => {
    res.render('index');
});
//multer업로드
app.post('/upload', upload.array('files'), (req, res) => {
    res.send(req.files);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
