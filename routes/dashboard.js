const express = require('express');
const fs = require('fs');
const path = require('path');
const { checkAuth } = require('../auth');
const router = express.Router();

router.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/dashboard/emails.html'));
});

router.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/dashboard/login.html'));
});

router.get('/:pageName', (req, res) => {
    const file = path.join(__dirname, '../public/dashboard/' + req.params.pageName + '.html');
    if(fs.existsSync(file)){
        return res.sendFile(file);
    } else {
        return res.sendFile(path.join(__dirname, '../public/client/404Notfound.html'));
    }
});

module.exports = router;