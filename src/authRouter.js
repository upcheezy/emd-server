const express = require('express');
const EmdService = require('./service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();
const bodyParser = express.json();



authRouter
    .route('/login')
    .post(bodyParser, (req, res, next) => {
        const {
            username,
            password
        } = req.body
        EmdService.getLogin(
                req.app.get('db'),
                username,
                password
            )
            .then(user => {
                if (!user) {
                    // throw new Error()
                }
                console.log(user.rows[0].password)
                return bcrypt.compare(password, user.rows[0].password)
            })
            .then(validate => {
                if (!validate) {
                    //throw new Error()
                }
                const token = jwt.sign({
                    username
                }, 'ejenghenduyerhsnehcyjeksleodjendy')
                res
                    .status(200)
                    .json({
                        token: token,
                        username: username
                    })
            })
            .catch(next)
    })

authRouter
    .route('/signup')
    .post(bodyParser, (req, res, next) => {
        console.log(req)
        const {
            firstname,
            lastname,
            email,
            username,
            password,
        } = req.body
        bcrypt.hash(password, 12)
            .then(hashedPw => {
                EmdService.addUser(
                        req.app.get('db'),
                        firstname,
                        lastname,
                        email,
                        username,
                        hashedPw
                    )
                    .then(data => {
                        res
                            .status(201)
                            .json(data)
                    })
                    .catch(next)
            })
    })

module.exports = authRouter;