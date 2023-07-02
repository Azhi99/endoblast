const express = require ('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const db = require('./db/dbConfig');
const path = require('path');

const app = express();

const userRouter = require('./routes/user');
const certificateRouter = require('./routes/certificate');
const serviceRouter = require('./routes/service');
const emailRouter = require('./routes/emails.js')
const contactRouter = require('./routes/contactUs')
const aboutRouter = require('./routes/about.js')
const enRouter = require('./routes/serveEnglish.js')
const kuRouter = require('./routes/serveKurdish.js')
const arRouter = require('./routes/serveArabic.js')

const dashboardRouter = require('./routes/dashboard');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public/client'));

app.use('/en', enRouter);
app.use('/ku', kuRouter);
app.use('/ar', arRouter);
app.use('/users', userRouter);
app.use('/certificates', certificateRouter);
app.use('/services', serviceRouter);
app.use('/emails', emailRouter)
app.use('/contactUs', contactRouter)
app.use('/aboutUs', aboutRouter)
app.use('/dr0a1sh/dashboard', dashboardRouter);

app.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password;
    db('tbl_users').where('username', username).select('*').then((data) => {
        if(data.length == 1) {
            bcrypt.compare(password, data[0].password, (err, result) => {
                if(result) {
                    const token = jwt.sign({
                        loggedIn: true
                    }, 'dr0a1sh', {
                        expiresIn: '6h'
                    });
                    return res.status(200).send({
                        token
                    });
                } else {
                    return res.status(500).send({
                        message: 'Invalid password'
                    });
                }
            });
        } else {
            return res.status(500).send({
                message: 'Invalid username'
            });
        }
    });
});

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, './public/client/en/index.html'));
});
app.get('/sitemap.xml', (req, res) => {
    return res.sendFile(path.join(__dirname, './sitemap.xml'));
});

app.get('/isLogged', (req, res) => {
    const token = (req.headers.authorization || '').split(' ')[1];
        try {
            jwt.verify(token, 'dr0a1sh');
            return res.sendStatus(200);
        } catch (error) {
            return res.sendStatus(500);
        }
});

app.get('*', (req ,res) => {
    return res.sendFile(path.join(__dirname, './public/client/404Notfound.html'));
});

app.listen(process.env.PORT, () => {
    console.log("Server Started at port " + process.env.PORT);
});
