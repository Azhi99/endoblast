const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/dbConfig');
const { checkAuth } = require('../auth');
const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: './public/certificateImages',
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('Invalid file type'));
        }
    }
}).single('certificateImage');

router.post('/addCertificate', checkAuth, (req, res) => {
    upload(req, res, async (err) => {
        if(!err){
            try {
                await db('tbl_certificates').insert({
                    image_path: './certificateImages/' + req.file.filename
                });
                return res.sendStatus(200);
            } catch (error) {
                return res.sendStatus(500);
            }
        }
        return res.status(500).send({
            message: err
        });
    });
});

router.delete('/deleteCertificate/:c_id', checkAuth, async (req, res) => {
    var [{image}] = await db('tbl_certificates').where('c_id', req.params.c_id).select(['image_path as image']);
    image = './public/' + image.slice(1);
    await db('tbl_certificates').where('c_id', req.params.c_id).delete();
    if(fs.existsSync(image)) {
        fs.unlinkSync(image);
        return res.sendStatus(200);
    }
});

router.get('/getData', async (req, res) => {
    const images = await db('tbl_certificates').select('*').orderBy('c_id', 'desc');
    return res.status(200).send(images);
});

router.get('/images/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/certificateImages/'+req.params.name))
})

module.exports = router;