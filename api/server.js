const express = require('express');

const usersRouter = require('../users/users-router');
const authRouter = require('../auth/router')
const restricted = require('../auth/restricted-middleware');

const server = express();

server.use(express.json());

server.use('/api/users', restricted, checkRole('user'), usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({ api: "up"});
})

module.exports = server;

function checkRole(role) {
    return (req, res, next) => {
        if (
            req.decodedToken &&
            req.decodedToken.role &&
            req.decodedToken.role.toLowerCase() === role
        ) {
            next();
        } else {
            res.status(403).json({ you: "Arent getting in!"})
        }
    }
}