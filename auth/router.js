const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const { jwtSecret } = require('../config/secrets');

router.post('/register', (req, res) => {
    const userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 8);
    userInfo.password = hash;

    Users.add(userInfo)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({username})
        .then(([user]) => {
            console.log(user);
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({ message: `Hello ${user.username}`, token })
            } else {
                res.status(401).json({ message: 'invalid credentials given.'})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({ message: "you were unable to logout", error})
            } else {
                res.status(200).json({ message: 'Logout was successful.'})
            }
        });
    } else {
        res.status(200).json({ message: 'already logged out'})
    }
})

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department,
        role: user.role || "user",
    };
    const options = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, jwtSecret, options);
}


module.exports = router;