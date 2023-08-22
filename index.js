const express = require('express');
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk')//aws 설정을 위한 모듈
const multerS3 = require('multer-s3')// aws s3에 업로드하기 위한 multer설정
const app = express();
const PORT = 8000;

//aws설정
aws.config.update({
    accessKeyId:'AKIA52U6VW2QISTMEL6A',
    secretAccessKey:'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',
    region:'ap-southeast-2'
})
//aws s3 인스턴스 생성
const s3 = new aws.S3()

//view engine 설정
app.set('view engine', 'ejs');
//정적파일세팅
app.use('/uploads', express.static(__dirname + '/uploads'));
//multer 설정
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         //확장자 분리
//         const ext = path.extname(file.originalname);
//         cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//     },
// });
// const upload = multer({ storage });

//multer 설정 - aws
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'woo-server-review-bucket',
        acl:'public-read', // 파일 접근 권한(public-read로 해야 업로드된 파일이 공개)
        metadata: function(req,file,cb){
            cb(null,{fieldName:file.filename})
        },
        key: function(req,file,cb){
            cb(null,Date.now().toString()+'-'+file.originalname)
        }

    })

})

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
