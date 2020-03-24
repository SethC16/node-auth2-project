const router = require('express').Router();
const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware')

router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => res.json(error));
})

module.exports = router;