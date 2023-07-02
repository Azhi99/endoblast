const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/:file', (req, res) => {
    const file = path.join(__dirname, '../public/client/en/' + req.params.file + '.html');
    if(fs.existsSync(file)){
        return res.sendFile(file);
    } 
    return res.sendFile(path.join(__dirname, '../public/client/en/404.html'));
});

router.get('/:folder/:file', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/client/en/assets/' + req.params.folder + '/' + req.params.file));
});

router.get('/:folder/:subFolder/:file', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/client/en/assets/' + req.params.folder + '/' + req.params.subFolder + '/' + req.params.file));
});

module.exports = router;