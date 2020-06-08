const express = require('express');
const EmdService = require('./service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EmdRouter = express.Router();
const bodyParser = express.json();

EmdRouter
    .route('/counties')
    .get((req, res, next) => {
        EmdService.getAllCountyNames(req.app.get('db'))
            .then(counties => {
                res.json(counties)
            })
    })

EmdRouter
    .route('/draw')
    .post(bodyParser, (req, res, next) => {
        // console.log(req.body)
        // destructuring below
        const {
            coords,
            geomtype
        } = req.body
        EmdService.getIntersects(
                req.app.get('db'),
                geomtype,
                coords
            )
            .then(data => {
                res
                    .status(201)
                    .json(data)
            })
            .catch(next)
    })

EmdRouter
    .route('/countyselect')
    .post(bodyParser, (req, res, next) => {
        const {
            countyname
        } = req.body
        EmdService.getCounties(
                req.app.get('db'),
                countyname
            )
            .then(data => {
                res
                    .status(201)
                    .json(data)
            })
            .catch(next)
    })

EmdRouter
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
               const token = jwt.sign({username}, 'ejenghenduyerhsnehcyjeksleodjendy')
               res
                .status(200)
                .json({token: token, username: username})
            })
            .catch(next)
    })

EmdRouter
    .route('/signup')
    .post(bodyParser, (req, res, next) => {
        const {
            username,
            password
        } = req.body
        bcrypt.hash(password, 12)
            .then(hashedPw => {
                EmdService.addUser(
                        req.app.get('db'),
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

module.exports = EmdRouter;