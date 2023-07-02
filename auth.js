const jwt = require('jsonwebtoken');
const path = require('path');

module.exports = {
    checkAuth: (req, res, next) => {
        const token = (req.headers.authorization || '').split(' ')[1];
        try {
            jwt.verify(token, 'dr0a1sh');
            next();
        } catch (error) {
            return res.sendFile(path.join(__dirname, '/public/client/404Notfound.html'));
        }
    }
};