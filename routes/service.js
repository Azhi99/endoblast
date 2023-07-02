const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/dbConfig');
const { checkAuth } = require('../auth');
const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: './public/serviceImages',
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
}).single('serviceImage');

router.post('/addService', checkAuth, async (req, res) => {
    upload(req, res, async (err) => {
        if(!err){
            try {
                await db('tbl_services').insert({
                    title_en: req.body.title_en,
                    title_ku: req.body.title_ku,
                    title_ar: req.body.title_ar,
                    desc_en: req.body.desc_en,
                    desc_ku: req.body.desc_ku,
                    desc_ar: req.body.desc_ar,
                    image_path: './serviceImages/' + req.file.filename
                });
                return res.sendStatus(200);
            } catch (error) {
                return res.status(500).send({
                    error
                })
            }
        } else {
            return res.status(500).send({
                message: 'File type may invalid'
            })
        }
    });
});

router.patch('/updateImage/:s_id', checkAuth, (req, res) => {
    upload(req, res, async (err) => {
        if(!err) {
            try {
                const [{oldImage}] = await db('tbl_services').where('s_id', req.params.s_id).select(['image_path as oldImage']);
                await db('tbl_services').where('s_id', req.params.s_id).update({
                    image_path: './serviceImages/' + req.file.filename
                });
                fs.unlinkSync('./public' + oldImage.slice(1));
                return res.sendStatus(200);
            } catch (error) {
                return res.status(500).send({ error });
            }
        }
        return res.status(500).send({
            message: 'File type may invalid'
        });
    });
});

router.patch('/updateService/:s_id', checkAuth, async (req, res) => {
    try {
        await db('tbl_services').where('s_id', req.params.s_id).update({
            title_en: req.body.title_en,
            title_ku: req.body.title_ku,
            title_ar: req.body.title_ar,
            desc_en: req.body.desc_en,
            desc_ku: req.body.desc_ku,
            desc_ar: req.body.desc_ar,
        });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send({
            error
        });
    }
});

router.delete('/deleteService/:s_id', checkAuth, async (req, res) => {
    try {
        const [{image}] = await db('tbl_services').where('s_id', req.params.s_id).select(['image_path as image']);
        await db('tbl_services').where('s_id', req.params.s_id).delete();
        fs.unlinkSync('./public/' + image.slice(1));
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send({
            error
        });
    }
});

router.get('/getServices/:lang', async (req, res) => {
    if(['en', 'ku', 'ar'].includes(req.params.lang)){
        const services = await db('tbl_services').select([
            's_id',
            'title_' + req.params.lang,
            'desc_' + req.params.lang,
            'image_path'
        ]).orderBy('s_id', 'asc');
        return res.status(200).send(services);
    }
    return res.status(404).send({
        message: 'Not found'
    });
});

router.get('/getOneService/:s_id', async (req, res) => {
    const [service] = await db('tbl_services').where('s_id', req.params.s_id).select([
        's_id',
        'title_en',
        'title_ar',
        'title_ku',
        'desc_en',
        'desc_ar',
        'desc_ku'
    ]);
    return res.status(200).send(service);
});

router.get('/images/:name', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/serviceImages/' + req.params.name));
});

module.exports = router;